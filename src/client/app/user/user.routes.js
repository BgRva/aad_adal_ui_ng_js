(function () {
  'use strict';

  angular
    .module('app.user')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'user',
        config: {
          url: '/user',
          templateUrl: 'app/user/user.html',
          controller: 'UserCtrl',
          controllerAs: 'vm',
          title: 'user',
          requireADLogin: true
        }
      }
    ];
  }
})();
