(function () {
  'use strict';

  var app = angular.module('app');

  //--
  app.config(authHeader);

  authHeader.$inject = ['$httpProvider', 'adalAuthenticationServiceProvider', 'appConfig'];
  /* @ngInject */
  function authHeader($httpProvider, adalAuthenticationServiceProvider, appConfig) {

    adalAuthenticationServiceProvider.init(
      {
        //instance: appConfig.instance,
        tenant: appConfig.tenant,
        clientId: appConfig.clientId,
        endpoints: appConfig.endpoints,
        //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
        anonymousEndpoints: [
          //'app/todos/todos.html'
        ]
      },
      $httpProvider
    );
    console.log('appConfig: ', appConfig);
  }
})();
