/*
 * Env file
 */
(function (window) {
  window.__env = window.__env || {};

  window.__env.version = 'dev Test2';

  window.__env.todoApiBase = 'http://localhost:51281/api/';

  window.__env.eventApiBase = 'http://localhost:49901/api/';

  window.__env.instance = 'http://login.microsoftonline.com/';
  window.__env.tenant = '';
  window.__env.clientId = '';
  window.__env.endpoints = { };

  // Setting this to false will disable console output
  window.__env.enableDebug = true;
  console.log('@@ ENV: ' + window.__env.version);
}(this));
