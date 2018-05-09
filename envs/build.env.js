/*
 * Default build env settings
 */
(function (window) {
  window.__env = window.__env || {};

  window.__env.version = 'build';

  window.__env.todoApiBase = 'http://localhost:5004/api/';

  window.__env.eventApiBase = 'http://localhost:5008/api/';

  window.__env.instance = 'https://login.microsoftonline.com/';
  window.__env.tenant = 'XXXXXXXXX.onmicrosoft.com';
  window.__env.clientId = 'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQ';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
  console.log('@@ ENV: ' + window.__env.version);
}(this));
