(function () {
  'use strict';

  angular
    .module('app.core')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    var otherwise = '/';
    routerHelper.configureStates(getStates(), otherwise);
  }

  function getStates() {
    return [
      {
        state: 'home',
        config: {
          url: '/',
          templateUrl: 'app/home/home.html',
          title: 'home'
        }
      }
    ];
  }
})();

