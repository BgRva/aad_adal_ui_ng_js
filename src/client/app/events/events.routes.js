(function () {
  'use strict';

  angular
    .module('app.events')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'events',
        config: {
          url: '/events',
          templateUrl: 'app/events/events.html',
          controller: 'EventsCtrl',
          controllerAs: 'vm',
          title: 'Events'
        }
      }
    ];
  }
})();
