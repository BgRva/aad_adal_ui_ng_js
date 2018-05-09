/*jshint node:true*/
'use strict';

/*
 * Main express app
 *
 * This app uses three submodules, one to handle todoui service endpoints: 'todoapi',
 * and one to handle auth endpionts: 'auth', one for the todoui api:  'eventapi'.
 * Each submudule is encapsulated in a folder.
 *
 * This app also uses certain settings from gulp.config.js
 *
 * See the following for a good explanation of submodules:
 * https://derickbailey.com/2016/02/17/using-express-sub-apps-to-keep-your-code-clean/
 */

// submodule endpoints, this matches what is in dev.env.js file
var todoBaseUrl = '/api1';
var eventBaseUrl = '/api2';
var authBaseUrl = '/api3';

var express = require('express');

// main app
var app = express();

// create express submodules for different domains
var auth = require('./auth/app');
var todoapi = require('./todoapi/app');
var eventapi = require('./eventapi/app');

var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();
var cors = require('cors');
var routes;

var environment = process.env.NODE_ENV;
//enable cors
app.use(cors());
app.options('*', cors());

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

//set sub-apps to urls
app.use(authBaseUrl, auth);
app.use(todoBaseUrl, todoapi);
app.use(eventBaseUrl, eventapi);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function (req, res, next) {
  console.log(req.body);
  res.send('pong');
});

switch (environment) {
  case 'build':
    console.log('** BUILD **');
    app.use(express.static('./build/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function (req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./build/index.html'));
    break;
  default:
    console.log('** DEV **');
    app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    app.use(express.static('./tmp'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function (req, res, next) {
      console.log('invalid call: req' + JSON.stringify(req));
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./src/client/index.html'));
    break;
}

app.listen(port, function () {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});
