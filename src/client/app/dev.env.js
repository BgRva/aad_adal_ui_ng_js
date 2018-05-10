/*
 * Env file corresponding to the AAD Test2 applications
 */
(function (window) {
  window.__env = window.__env || {};

  window.__env.version = 'dev Test2';

  // API base urls used in the data service
  window.__env.todoApiBase = 'http://localhost:51281/api/';
  window.__env.eventApiBase = 'http://localhost:49901/api/';

  window.__env.instance = 'http://login.microsoftonline.com/';
  window.__env.tenant = 'XXXXXXXXX.onmicrosoft.com';
  window.__env.clientId = 'QQQQQQQQQQQQQQQQQQQQQQQQQQ';
  window.__env.endpoints = {
    'localhost:5004': 'https://XXXXXXXXX.onmicrosoft.com/AAAAAAAAAAAAAAAAAAAAAAA',
    'localhost:5008': 'https://XXXXXXXXX.onmicrosoft.com/BBBBBBBBBBBBBBBBBBBBBBB'
  };

  // Setting this to false will disable console output
  window.__env.enableDebug = true;
  console.log('@@ ENV: ' + window.__env.version);
}(this));
