(function () {
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$q', '$rootScope', '$timeout',
                           'adalAuthenticationService', 'logger', 'config'];
  /* @ngInject */
  function AppController($q, $rootScope, $timeout,
                         adalSrvc, logger, config) {
    var vm = this;
    vm.busyMessage = 'Please wait ...';
    vm.isBusy = true;
    $rootScope.showSplash = true;

    vm.logout = logout;
    vm.login = login;

    ///////////////////

    activate();

    function login() {
      console.log('logging in ...');
      adalSrvc.login();
    }

    function logout() {
      console.log('logging out ...');
      adalSrvc.logOut();
    }

    function activate() {
      vm.loading = true;
      var promises = [];
      return $q.all(promises).then(function () {
        logger.success(config.appTitle + ' loaded!');
        hideSplash();
        vm.loading = false;

        //
        // console.log('userInfo: ' + angular.toJson($rootScope.userInfo));
      });
    }

    function hideSplash() {
      //Force a 1 second delay so we can see the splash.
      $timeout(function () {
        $rootScope.showSplash = false;
      }, 1000);
    }
  }
})();
