(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$q', '$location', 'logger'];
  /* @ngInject */
  function HomeCtrl($q, $location, logger) {
    var vm = this;
    vm.title = 'Home';
    vm.loading = false;
    vm.login = login;
    vm.logout = logout;
    vm.isActive = isActive;

    activate();

    ////////////////////

    function activate() {
      vm.loading = true;
      var promises = [];
      return $q.all(promises).then(function () {
        logger.info('Activated Home View');
        vm.loading = false;
      });
    }

    function login() {
      logger.info('Logging in ....');
    }

    function logout() {
      logger.info('Logging out ....');
    }

    function isActive(viewLocation) {
      logger.info('Logging in ....');
      return viewLocation === $location.path();
    }
  }
})();

