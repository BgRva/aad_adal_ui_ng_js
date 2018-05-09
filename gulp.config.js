
// define the config as a node module
module.exports = function () {
  var client = './src/client/';
  var server = './src/server/';
  var clientApp = client + 'app/';
  var report = './report/';
  var root = './';
  var specRunnerFile = 'specs.html';
  var temp = './.tmp/';
  var wiredep = require('wiredep');
  // we can use wiredep to get bower files
  var bowerFiles = wiredep({ devDependencies: true })['js'];
  var bower = {
    json: require('./bower.json'),
    directory: './bower_components/',
    ignorePath: '../..'
  };
  var nodeModules = 'node_modules';

  var config = {
    // all javascript that we want to vet
    alljs: [
      './src/**/*.js',
      './*.js'
    ],
    //??appConfigTarget : clientApp + 'core/',
    // build folder where production code goes, app.js depends on this
    build: './build/',
    client: client,
    //?constantsSrvc: clientApp + 'core/constants.js',
    css: temp + 'styles.css',
    //fonts: bower.directory + 'font-awesome/fonts/**/*.*',
    fonts: [
      bower.directory + 'font-awesome/fonts/**/*.*',
      bower.directory + 'bootstrap/dist/fonts/*.*'
    ],
    html: client + '**/*.html',
    htmltemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    favico: 'favicon.ico',
    index: client + 'index.html',
    // app js, with no specs
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js',
      '!' + clientApp + '**/*.spec.js'
    ],
    jsOrder: [
      '**/app.module.js',
      '**/*.module.js',
      '**/*.js'
    ],
    // name of the input less file
    less: client + 'styles/styles.less',
    report: report,
    root: root,
    server: server,
    source: 'src/',
    stubsjs: [
      bower.directory + 'angular-mocks/angular-mocks.js',
      client + 'stubs/**/*.js'
    ],
    temp: temp,

    /**
     * env config files
     */
    envs : {
      glob: '**/*.env.js',
      dev: clientApp + 'dev.env.js',
      build: './envs/build.env.js'
    },

    /**
     * names of files output from optimize task,
     */
    optimized: {
      // app.js will contain all application js files concatenated into one
      app: 'app.js',
      // app.js will contain all 3rd party lib js files concatenated into one
      lib: 'lib.js'
    },

    /**
     * plato
     */
    plato: { js: clientApp + '**/*.js' },

    /**
     * browser sync
     */
    browserReloadDelay: 1000,

    /**
     * template cache
     */
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'app.core',
        root: 'app/',
        standalone: false
      }
    },

    /**
     * Bower and NPM files
     */
    bower: bower,
    packages: [
      './package.json',
      './bower.json'
    ],

    /**
     * specs.html, our HTML spec runner
     */
    specRunner: client + specRunnerFile,
    specRunnerFile: specRunnerFile,

    /**
     * The sequence of the injections into specs.html:
     *  1 testlibraries
     *      mocha setup
     *  2 bower
     *  3 js
     *  4 spechelpers
     *  5 specs
     *  6 templates
     */
    testlibraries: [
      nodeModules + '/chai/chai.js',
      nodeModules + '/mocha/mocha.js',
      nodeModules + '/sinon-chai/lib/sinon-chai.js'
    ],
    specHelpers: [client + 'test-helpers/*.js'],
    specs: [clientApp + '**/*.spec.js'],

    /**
     * tests that deal with server level integration
     */
    serverIntegrationSpecs: [],

    /**
     * Node settings
     */
    nodeServer: server + 'app.js',
    defaultPort: '8001',
    warFile: 'ROOT.war'
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = function () {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  /**
   * karma settings
   */
  config.karma = {}; //getKarmaOptions();

  return config;

  ////////////////

  /**
   * returns Karma options
   */
  function getKarmaOptions() {
    var options = {
      files: [].concat(
        // all 3rd party files & libs
        bowerFiles,
        // js files that are run at dev time to help tests, i.e. stubs or mocks
        config.specHelpers,
        // load application js files, module defining files first
        clientApp + '**/*.module.js',
        clientApp + '**/*.js',
        temp + config.templateCache.file,
        config.serverIntegrationSpecs
      ),
      exclude: [],
      coverage: {
        // report directory to put coverage reports in
        dir: report + 'coverage',
        // settings for karma to define what reports to show
        reporters: [
          // reporters not supporting the `file` property
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' },
          // omit filename will output to console
          { type: 'text-summary' } //, subdir: '.', file: 'text-summary.txt'}
        ]
      },
      preprocessors: {}
    };
    // specify that coverage will be applied to code tested, but exclude specs from coverage
    options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  }
};
