/*
 * Env file corresponding to the AAD Test applications
 */
(function (window) {
  window.__env = window.__env || {};

  window.__env.version = 'dev Test1';

  window.__env.todoApiBase = 'http://localhost:5004/api/';

  window.__env.eventApiBase = 'http://localhost:5008/api/';

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
