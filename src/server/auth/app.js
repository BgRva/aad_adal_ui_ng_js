/*jshint node:true*/
'use strict';

/*
 * AUTH express sub-module
 */

var express = require('express');
var routes = require('./routes');

var bodyParser = require('body-parser');
var logger = require('morgan');

var environment = process.env.NODE_ENV;

// ------
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

// ------
app.use('/', routes);

// ------
module.exports = app;

console.log('auth ......');
