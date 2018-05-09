var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({ lazy: true });

var colors = $.util.colors;
var envenv = $.util.env;
var port = process.env.PORT || config.defaultPort;

/**********************
 * yargs variables can be passed in to alter the behavior of some
 * tasks, note only some tasks use args.
 * Example: gulp serve-dev
 *
 * --env=(dev|build)  Specifies the env file to load, defaults to dev.
 * --noMunge          no minify/uglify/squashing performed during optimize
 * --verbose          Various tasks will produce more output to the console.
 * --nosync           Don't launch the browser with browser-sync when serving code.
 * --debug            Launch debugger with node-inspector.
 * --debug-brk        Launch debugger and break on 1st line with node-inspector.
 * --startServers     Will start servers for midway tests on the test task.
 *
 * Examples:
 *      gulp serve-build --noMunge    // build & run build without minify+uglify
 *      gulp serve-build --env=dev    // build  & run using dev env file
 */

/**********************
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);

/**********************
 * Calls help as the gulp default task
 */
gulp.task('default', ['help'], function () {
  var munge = !args.noMunge;
  if (munge) {
    log('ON: munge: ' + munge);
  } else {
    log('OFF: munge: ' + munge);
  }
});

/**********************
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function () {
  log('Analyzing source with JSHint and JSCS');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs());
});

/**********************
 * Create a visualizer report
 */
gulp.task('plato', function (done) {
  log('Analyzing source with Plato');
  log('Browse to /report/plato/index.html to see Plato results');

  startPlatoVisualizer(done);
});

/**********************
 * Compile less to css and writes output in config.temp
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function () {
  log('Compiling Less --> CSS');

  return gulp
    .src(config.less)
    // exit gracefully if something fails after this
    .pipe($.plumber())
    .pipe($.less())
    // browser support for last 2 versions and must have greater than 5% of market
    .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
    .pipe(gulp.dest(config.temp));
});

/**********************
 * Copy fonts to build destination
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], function () {
  var dest = config.build + 'fonts';
  log('Copying fonts to ' + dest);

  return gulp
    .src(config.fonts)
    .pipe(gulp.dest(dest));
});

/**********************
 * Compress images and apply compression or other processing
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function () {
  log('Compressing and copying images');

  return gulp
    .src(config.images)
    .pipe($.imagemin({ optimizationLevel: 4 }))
    .pipe(gulp.dest(config.build + 'images'));
});

/**********************
 * Copies the favicon to the proper build folder
 * @return {Stream}
 */
gulp.task('favico', function () {
  log('Copying favicon to build');

  return gulp
    .src(config.server + config.favico)
    .pipe(gulp.dest(config.build));
});

/**********************
 * Watches the less files and kicks off a the 'styles' task if they change
 */
gulp.task('less-watcher', function () {
  // the 2nd param is an array of task names to run on the files
  // identified in the first param
  gulp.watch([config.less], ['styles']);
});

/**********************
 * Create $templateCache from the html templates; (see templates.js in .tmp)
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function () {
  log('Creating an AngularJS $templateCache');

  return gulp
    .src(config.htmltemplates)
    .pipe($.if(args.verbose, $.bytediff.start()))
    .pipe($.minifyHtml({ empty: true }))
    .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
    .pipe($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.temp));
});

/**********************
 * Wires-up the dependencies in bower_components and the application js
 * files and injects them into the index.html file
 *  --env=(dev|build)
 *  --stubs  // rarely used
 * @return {Stream}
 */
gulp.task('wiredep', function() {
  log('Wiring the bower dependencies and js files into index.html');
  var env = getEnv();

  var wiredep = require('wiredep').stream;
  var options = config.getWiredepDefaultOptions();

  // Get all applicable js files to be injected, only
  // include stubs if flag is enabled and exclude any env files
  var js = args.stubs ? [].concat(config.js, config.stubsjs, '!' + config.envs.glob)
                      : [].concat(config.js, '!' + config.envs.glob);

  // Get the env file
  var envFile = '';
  if (env === 'build') {
    envFile = config.envs.build;
  } else {
    envFile = config.envs.dev;
  }
  log('Env file: ' + envFile);

  //get the env file
  var envStream = gulp.src([envFile]);

  // get all other application js files
  var appStream = gulp.src(js)
    .pipe($.order(config.jsOrder));

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(envStream, { starttag: '<!-- inject:env:{{ext}} -->'}))
    .pipe($.inject(appStream))
    .pipe(gulp.dest(config.client));
});

/**********************
 * Injects the css into the index.html following the completion
 * of the specified dependency tasks.
 * @return {Stream}
 */
gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function () {
  log('Wire up css into the html, after files are ready');

  // inject custom styles into index.html, 3rd party styles are handled in 'styles'
  return gulp
    .src(config.index)
    .pipe(inject([config.css]))
    .pipe(gulp.dest(config.client));
});

/**********************
 * Run the spec runner specs.html using mocha;
 * To start servers and run midway specs as well use
 * the arg as below:
 *    gulp serve-specs --startServers
 * @return {Stream}
 */
gulp.task('serve-specs', ['build-specs'], function (done) {
  log('run the spec runner');
  serve(true /* isDev */, true /* specRunner */);
  done();
});

/**********************
 * Inject all the spec files and dependencies into specs.html for
 * the mocha runner; this just prepares specs.html
 * @return {Stream}
 */
gulp.task('build-specs', ['templatecache'], function (done) {
  log('building the spec runner');

  var wiredep = require('wiredep').stream;
  var templateCache = config.temp + config.templateCache.file;
  var options = config.getWiredepDefaultOptions();
  var specs = config.specs;

  // This will force including the dev dependencies when injecting
  // into specs.html
  options.devDependencies = true;

  // if we are starting the server
  if (args.startServers) {
    specs = [].concat(specs, config.serverIntegrationSpecs);
  }

  return gulp
    .src(config.specRunner)
    .pipe(wiredep(options))
    .pipe(inject(config.js, '', config.jsOrder))
    .pipe(inject(config.testlibraries, 'testlibraries'))
    .pipe(inject(config.specHelpers, 'spechelpers'))
    .pipe(inject(specs, 'specs', ['**/*']))
    .pipe(inject(templateCache, 'templates'))
    .pipe(gulp.dest(config.client));
});

/**********************
 * Generates, opitimizes all files for deployment and places
 * everything in ./build folder;  cmmd line arg can be used to
 * set the env used in building the files but will default
 * to env = 'dev'
 *    gulp build --env={*env-name*}
 */
gulp.task('build', ['optimize', 'images', 'fonts', 'favico'], function () {
  log('Building everything');

  var msg = {
    title: 'gulp build',
    subtitle: 'Deployed to the build folder',
    message: 'Running `gulp build`'
  };
  del(config.temp);
  log(msg);
  notify(msg);
});

/**********************
 * Optimize all files, including minify, uglify, and move
 * results to a build folder and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject'], function () {
  log('Optimizing the js, css, and html');
  var munge = !args.noMunge;
  if (!munge) {
    log('optimize will skip minify + uglify');
  }

  var assets = $.useref.assets({ searchPath: './' });
  // filters help controll file sets in the pipeline
  var cssFilter = $.filter('**/*.css');
  var jsAppFilter = $.filter('**/' + config.optimized.app);
  var jslibFilter = $.filter('**/' + config.optimized.lib);
  var renameExlcudeFilter = $.filter(['**/*', '!**/env.js'], { restore: true });

  var templateCache = config.temp + config.templateCache.file;

  return gulp
    .src(config.index)
    .pipe($.plumber())
    .pipe(inject(templateCache, 'templates'))
    .pipe(assets) // Gather all assets from the html with useref
    // Get and process the css
    .pipe(cssFilter)
    .pipe($.if(munge, $.minifyCss()))
    .pipe(cssFilter.restore())
    // Get and process the custom javascript
    .pipe(jsAppFilter)
    // Ensures propert ng injection after mangling
    .pipe($.ngAnnotate({ add: true }))
    .pipe($.if(munge, $.uglify()))
    .pipe(getHeader())
    .pipe(jsAppFilter.restore())
    // Get and process vendor libraries
    .pipe(jslibFilter)
    .pipe($.if(munge, $.uglify()))
    .pipe(jslibFilter.restore())
    // Take inventory of the file names for future revision numbers
    // but exclude certain files from renaming
    .pipe(renameExlcudeFilter)
    .pipe($.rev())
    .pipe(renameExlcudeFilter.restore())
    // Apply the concat and file replacement with useref
    .pipe(assets.restore())
    .pipe($.useref())
    // Replace the file names in the html with files whose names are updated with rev numbers
    .pipe($.revReplace())
    // Output to destination build folder
    .pipe(gulp.dest(config.build))
    // Output the manifest file listing old and new files
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.build));
});

/**********************
 * Remove all files from the build, temp, and reports folders
 * @param {Function} done - callback when complete
 */
gulp.task('clean', function (done) {
  var delconfig = [].concat(config.build, config.temp, config.report);
  log('Cleaning: ' + $.util.colors.blue(delconfig));
  del(delconfig, done);
});

/**********************
 * Remove all fonts from the build folder
 * @param {Function} done - callback when complete
 */
gulp.task('clean-fonts', function (done) {
  clean(config.build + 'fonts/**/*.*', done);
});

/**********************
 * Remove all images from the build folder
 * @param {Function} done - callback when complete
 */
gulp.task('clean-images', function (done) {
  clean(config.build + 'images/**/*.*', done);
});

/**********************
 * Remove all styles from the build and temp folders
 * @param {Function} done - callback when complete
 */
gulp.task('clean-styles', function (done) {
  var files = [].concat(
    config.temp + '**/*.css',
    config.build + 'styles/**/*.css'
  );
  clean(files, done);
});

/**********************
 * Remove all js and html from the build and temp folders
 * @param {Function} done - callback when complete
 */
gulp.task('clean-code', function (done) {
  var files = [].concat(
    config.temp + '**/*.js',
    config.build + 'js/**/*.js',
    config.build + '**/*.html'
  );
  clean(files, done);
});

/**********************
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @param  {Function} done - callback when complete
 */
gulp.task('test', ['vet', 'templatecache'], function (done) {
  //log('Testing Disabled');
  startTests(true /*singleRun*/, done);
});

/**********************
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run backend integration specs as well:
 *    gulp autotest --startServers
 * @param  {Function} done - callback when complete
 */
gulp.task('autotest', function (done) {
  startTests(false /*singleRun*/, done);
});

/**********************
 * serve the dev environment and watch for changes
 *  --debug-brk or --debug
 *  --nosync
 */
gulp.task('serve-dev', ['inject'], function () {
  serve(true /*isDev*/);
});

/**********************
 * serve the build environment and watch for changes
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', ['build'], function () {
  serve(false /*isDev*/);
});

/**********************
 * Bump the version, defaults to bumping smallest part of version number
 * unless one of the args below is specified.
 *  --type=pre    will bump the prerelease version *.*.*-x
 *  --type=patch  or no flag will bump the patch version *.*.x
 *  --type=minor  will bump the minor version *.x.*
 *  --type=major  will bump the major version x.*.*
 *  --ver=1.2.3   will bump to a specific version and ignore other flags
 * @return {Stream}
 */
gulp.task('bump', function () {
  var msg = 'Bumping versions';
  var type = args.type;
  var version = args.ver;
  var options = {};
  if (version) {
    // if a version number is specified, add to options
    options.version = version;
    msg += ' to ' + options.version;
  } else {
    // otherwise specify the 'type' arg
    options.type = type;
    msg += ' for a ' + options.type;
  }
  log(msg);

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root));
});

/**********************
 * Optimize the code and re-load browserSync
 */
gulp.task('browserSyncReload', ['optimize'], browserSync.reload);

/**********************
 * Generates a WAR file from the contents of the ./build folder
 * and places the resulting file in ./dist folder; Note that this
 * task does not generate the build folder or validate the contents
 * of the build folder before it runs, ensure the build folder is
 * completely populated before running this task.
 */
gulp.task('war', function () {
  log('Generating WAR file from ./build folder');
  gulp
    .src(config.build + '**/*.*')
    .pipe($.war({
      welcome: 'index.html',
      displayName: 'ToDo List',
    }))
    .pipe($.zip(config.warFile))
    .pipe(gulp.dest('./dist'));
});

///////////////////
// functions
///////////////////

/**********************
 * When files change, log it; this is called from gulp.watch()
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**********************
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done);
}

/**********************
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name of where to inject, i.e. "<!-- inject:js -->"
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
  var options = { read: false };
  if (label) {
    options.name = 'inject:' + label;
  }

  return $.inject(orderSrc(src, order), options);
}

/**********************
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order  Glob array pattern
 * @returns {Stream}  The ordered stream
 */
function orderSrc(src, order) {
  //order = order || ['**/*'];
  return gulp
    .src(src)
    .pipe($.if(order, $.order(order)));
}

/**********************
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode (True/False)
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
  var debugMode = '--debug';
  var nodeOptions = getNodeOptions(isDev);

  // Note:  the next line causes a fail in later version of node
  // nodeOptions.nodeArgs = [debugMode + '=5858'];

  if (args.verbose) {
    console.log(nodeOptions);
  }

  //nodemon listens for restart/start/crash/exit events
  //nodemon is given some time to restart before browserSync
  return $.nodemon(nodeOptions)
    .on('restart', ['vet'], function (ev) {
      log('*** nodemon restarted');
      log('files changed:\n' + ev);
      setTimeout(function () {
        browserSync.notify('reloading now ...');
        browserSync.reload({ stream: false });
      }, config.browserReloadDelay);
    })
    .on('start', function () {
      log('*** nodemon started');
      startBrowserSync(isDev, specRunner);
    })
    .on('crash', function () {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function () {
      log('*** nodemon exited cleanly');
    });
}

/*
 * Returns an object with the current node.js options and settings
 */
function getNodeOptions(isDev) {

  var opts = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.server]
  };

  console.log('node options: ' + JSON.stringify(opts));
}

//function runNodeInspector() {
//    log('Running node-inspector.');
//    log('Browse to http://localhost:8080/debug?port=5858');
//    var exec = require('child_process').exec;
//    exec('node-inspector');
//}

/**********************
 * Start BrowserSync
 * --nosync will cause a quick return
 */
function startBrowserSync(isDev, specRunner) {
  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting BrowserSync on port ' + port);

  // If build: watches the files, builds, and restarts browser-sync.
  // If dev: watches less, compiles it to css, browser-sync handles reload

  if (isDev) {
    gulp.watch([config.less], ['styles'])
      .on('change', changeEvent);
  } else {
    gulp.watch([config.less, config.js, config.html], ['browserSyncReload'])
      .on('change', changeEvent);
  }

  var options = {
    //proxy: 'localhost:' + port,
    proxy: {
      target: 'localhost:' + port + '/',
    },
    port: 3000,
    files: isDev ? [
      config.client + '**/*.*',
      '!' + config.less,
      config.temp + '**/*.css'
    ] : [],
    ghostMode: { // these are the defaults t,f,t,t
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'info',
    logPrefix: 'hottowel',
    notify: true,
    reloadDelay: 1000
  };

  // if running the specRunner, update the startPath so
  // browserSync uses the spec runner file
  if (specRunner) {
    options.startPath = config.specRunnerFile;
  }

  log('>> starting browserSync ...');
  browserSync(options);
  // var bs = browserSync.create();
  // bs.init(options, function(err, bs) {
  //   require('opn')(bs.options.getIn(['urls','local']), {app: ['google chrome', '--incognito']});
  // });
  browserSync.options.getIn(['urls','local'], {app: ['google chrome', '--incognito']});
}

/**********************
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer(done) {
  log('Running Plato');

  var files = glob.sync(config.plato.js);
  var excludeFiles = /.*\.spec\.js/;
  var plato = require('plato');

  var options = {
    title: 'Plato Inspections Report',
    exclude: excludeFiles
  };
  var outputDir = config.report + '/plato';

  plato.inspect(files, outputDir, options, platoCompleted);

  function platoCompleted(report) {
    var overview = plato.getOverviewReport(report);
    if (args.verbose) {
      log(overview.summary);
    }
    if (done) { done(); }
  }
}

/**********************
 * Start the tests using karma.
 * --startServers : start node server backend for integration based tests
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
  var child;
  var excludeFiles = [];
  var fork = require('child_process').fork;
  // grab karma, this will only occur when this function is called
  var Karma = require('karma').Server;
  var serverSpecs = config.serverIntegrationSpecs;

  if (args.startServers) {
    log('Starting server');
    var savedEnv = process.env;
    savedEnv.NODE_ENV = 'dev';
    savedEnv.PORT = 8888;
    child = fork(config.nodeServer);
  } else {
    // if there are valid server specs ...
    if (serverSpecs && serverSpecs.length) {
      excludeFiles = serverSpecs;
    }
  }

  // pass in {options} and callback
  new Karma({
    // '__dirname' is a variable from node that tell us the directory,
    // and tell where to find karma configurations
    configFile: __dirname + '/karma.conf.js',
    exclude: excludeFiles,
    singleRun: !!singleRun
  }, karmaCompleted).start();

  //-----------------

  function karmaCompleted(karmaResult) {
    log('Karma completed');
    // if we have started a child process, shut it down nicely
    if (child) {
      log('shutting down the child process');
      child.kill();
    }
    if (karmaResult === 1) {
      done('karma: tests failed with code ' + karmaResult);
    } else {
      done();
    }
  }
}

/**********************
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
  var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
  return data.fileName + ' went from ' +
    (data.startSize / 1000).toFixed(2) + ' kB to ' +
    (data.endSize / 1000).toFixed(2) + ' kB and is ' +
    formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**********************
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
  return (num * 100).toFixed(precision);
}

/**********************
 * Format and return the header for files
 * @return {String}  Formatted file header
 */
function getHeader() {
  var pkg = require('./package.json');
  var template = ['/**********************',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @authors <%= pkg.authors %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n');
  return $.header(template, {
    pkg: pkg
  });
}

/**********************
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 * @param {Array|String} msg can be a string or an array of strings
 */
function log(msg) {
  if (typeof (msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

/**********************
 * Show OS level notification using node-notifier
 * @param {Object}  options with format {title: x, subtitle: x, message: x}
 */
function notify(options) {
  var notifier = require('node-notifier');
  var notifyOptions = {
    sound: 'Bottle',
    contentImage: path.join(__dirname, 'gulp.png'),
    icon: path.join(__dirname, 'gulp.png')
  };
  _.assign(notifyOptions, options);
  notifier.notify(notifyOptions);
}

/**********************
 * checks and returns the env setting, if it is not set then
 * it devaults to 'dev';  env will be assigned to NODE_ENV,
 * optional cmd line args will take precedent
 *     gulp task --env=(dev|build)
 * @returns {String}  env setting
 */
function getEnv() {
  var env = '';

  if (args.env) {
    if (args.env === 'build') {
      log('Env (arg): build');
      env = args.env;
    } else if (args.env === 'dev') {
      log('Env (arg): dev');
      env = args.env;
    }
  }

  if (env === '') {
    log('Env (** using default **): dev');
    env = 'dev';
  }
  if (process.env) {
    process.env.NODE_ENV = env;
  }

  return env;
}

module.exports = gulp;
