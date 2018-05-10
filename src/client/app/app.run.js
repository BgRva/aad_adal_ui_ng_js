(function () {
  'use strict';

  angular
    .module('app')
    .run(appRun);

  appRun.$inject = ['$rootScope', 'authService'];
  /* @ngInject */
  function appRun($rootScope, authService) {
    $rootScope.auth = authService;
  }
})();
