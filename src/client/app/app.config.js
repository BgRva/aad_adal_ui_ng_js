(function () {
  'use strict';

  var app = angular.module('app');

  //--
  app.config(authHeader);

  authHeader.$inject = ['$httpProvider', 'appConfig'];
  /* @ngInject */
  function authHeader($httpProvider, appConfig) {
    console.log('appConfig: ', appConfig);
  }
})();
