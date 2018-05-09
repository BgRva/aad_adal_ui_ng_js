(function () {
  'use strict';

  angular
    .module('app.todos')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'todos',
        config: {
          url: '/todos',
          templateUrl: 'app/todos/todos.html',
          controller: 'TodosCtrl',
          controllerAs: 'vm',
          title: 'Todos'
        }
      }
    ];
  }
})();
