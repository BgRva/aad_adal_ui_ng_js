(function () {
  'use strict';

  angular
    .module('app.home')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'home',
        config: {
          url: '/home',
          templateUrl: 'app/home/home.html',
          controller: 'HomeCtrl',
          controllerAs: 'vm',
          title: 'Todos',
          settings: {
            nav: 1,
            content: '<i class="fa fa-holds"></i> Home'
          }
        }
      }
    ];
  }
})();
