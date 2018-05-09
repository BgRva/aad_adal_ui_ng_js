/*
 * This file serves as the fake data source behind the
 * end ponts.  Data is returned by the methods defined
 * in the module.exports.
 */
var dataFolder = '/../data/';
var jsonfileservice = require('./utils/jsonfileservice')();
var _ = require('lodash');

module.exports = {
  todos: getTodos(),
  events: getEvents(),
  users: getUsers(),
};

function getTodos() {
  var data = jsonfileservice.getJsonFromFile(dataFolder + 'todos.json');
  return data;
}

function getEvents() {
  var data = jsonfileservice.getJsonFromFile(dataFolder + 'events.json');
  return data.reg;
}

function getUsers() {
  var data = jsonfileservice.getJsonFromFile(dataFolder + 'users.json');
  return data.lic;
}
