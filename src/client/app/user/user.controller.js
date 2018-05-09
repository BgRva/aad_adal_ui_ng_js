(function () {
  'use strict';

  angular
    .module('app.user')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$q', 'dataService', 'logger'];
  /* @ngInject */
  function UserCtrl($q, dataService, logger) {
    var vm = this;
    vm.title = 'User';
    vm.userData = {};

    activate();

    ////////////////////

    function activate() {
      var promises = [getTodos()];
      return $q.all(promises).then(function () {
        logger.info('Activated User View');
      });
    }

    function getTodos() {
      return dataService.getAllTodo().then(function (data) {
        vm.todos = data;
        return vm.todos;
      });
    }
  }
})();
