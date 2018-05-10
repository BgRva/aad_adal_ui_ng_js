(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('authService', authService);

  authService.$inject = ['$rootScope', 'logger'];
  /* @ngInject */
  function authService($rootScope, logger) {
    var currentUser = null;
    var service = {
      isTodoReader: isTodoReader,
      isTodoWriter: isTodoWriter,
      isTodoApprover: isTodoApprover,
      isTodoAdmin: isTodoAdmin,
      isEventReader: isEventReader,
      isEventWriter: isEventWriter,
      isEventApprover: isEventApprover,
      isEventAdmin: isEventAdmin,
      isGlobalAdmin: isGlobalAdmin
    };

    return service;

    ///////////////////////////
    /*
    GlobalAdmin
      ToDoAdmin
      ToDoApprover
        ToDoWriter
        ToDoObserver
      EventAdmin
      EventApprover
        EventWriter
        EventObserver
    */

    function isTodoReader() {
      return hasRole(
        ['ToDoObserver', 'ToDoWriter', 'ToDoApprover', 'ToDoAdmin', 'GlobalAdmin']);
    }

    function isTodoWriter() {
      return hasRole(['ToDoWriter', 'ToDoApprover', 'ToDoAdmin', 'GlobalAdmin']);
    }

    function isTodoApprover() {
      return hasRole(['ToDoApprover', 'ToDoAdmin', 'GlobalAdmin']);
    }

    function isTodoAdmin() {
      return hasRole(['ToDoAdmin', 'GlobalAdmin']);
    }

    function isEventReader() {
      return hasRole(
        ['EventObserver', 'EventWriter', 'EventApprover', 'EventAdmin', 'GlobalAdmin']);
    }

    function isEventWriter() {
      return hasRole(['EventWriter', 'EventApprover', 'EventAdmin', 'GlobalAdmin']);
    }

    function isEventApprover() {
      return hasRole(['EventApprover', 'EventAdmin', 'GlobalAdmin']);
    }

    function isEventAdmin() {
      return hasRole(['EventAdmin', 'GlobalAdmin']);
    }

    function isGlobalAdmin() {
      return hasRole('GlobalAdmin');
    }

    /**
     * @name hasRole
     * @desc returns true if the current profile has at least one of the
     * authrolesorities specified in the input array of roles, otherwise false
     * is returned; if the token is not valid, null is returned
     * @param {Array|String} input is the array of role names or a single role
     * @returns {boolean} true, false
     */
    function hasRole(input) {
      if (!($rootScope.userInfo && $rootScope.userInfo.isAuthenticated)) {
        return false;
      }
      if (!input || input.length === 0) {
        return false;
      }
      if (!angular.isArray(input)) {
        return $rootScope.userInfo.profile.roles.includes(input);
      } else {
        for (var i = 0; i < input.length; i++) {
          for (var j = 0; j < $rootScope.userInfo.profile.roles.length; j++) {
            if (input[i] === $rootScope.userInfo.profile.roles[j]) {
              return true;
            }
          }
        }
      }
      return false;
    }
  }
})();
