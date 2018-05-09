(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('dataService', dataService);

  dataService.$inject = ['$http', '$location', '$q', 'exception', 'appConfig'];
  /* @ngInject */
  function dataService($http, $location, $q, exception, appConfig) {

    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];

    var service = {
      // Todo
      getAllTodo: getAllTodo,
      getTodo: getTodo,
      createTodo: createTodo,
      updateTodo: updateTodo,
      deleteTodo: deleteTodo,
      // Event
      getAllEvent: getAllEvent,
      getEvent: getEvent,
      createEvent: createEvent,
      updateEvent: updateEvent,
      deleteEvent: deleteEvent,
      // User
      getUser: getUser,
    };

    return service;

    ///////////////////////////

    function getAllTodo() {
      return $http.get(appConfig.todoApiBase + 'todo')
        .then(getAllTodoComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for getAllTodo')(message);
          $location.url('/');
        });

      function getAllTodoComplete(response) {
        return response.data;
      }
    }

    function getTodo(id) {
      return $http.get(appConfig.todoApiBase + 'todo/' + id)
        .then(getTodoComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for getTodo')(message);
          $location.url('/');
        });

      function getTodoComplete(response) {
        return response.data;
      }
    }

    function createTodo(todo) {
      return $http.post(appConfig.todoApiBase + 'todo', todo)
        .then(createTodoComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for createTodo')(message);
          $location.url('/');
        });

      function createTodoComplete(response) {
        return response.data;
      }
    }

    function updateTodo(todo) {
      var urlTail = '/todo/' + todo.id;
      return $http.put(appConfig.todoApiBase + 'todo/' + todo.id, todo)
        .then(updateTodoComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for updateTodo')(message);
          $location.url('/');
        });

      function updateTodoComplete(response) {
        return response.data;
      }
    }

    function deleteTodo(id) {
      return $http.delete(appConfig.todoApiBase + 'todo/' + id)
        .then(deleteTodoComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for deleteTodo')(message);
          $location.url('/');
        });

      function deleteTodoComplete(response) {
        return response.data;
      }
    }

    // To Go

    function getAllEvent() {
      return $http.get(appConfig.eventApiBase + 'event')
        .then(getAllEventComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for getAllEvent')(message);
          $location.url('/');
        });

      function getAllEventComplete(response) {
        return response.data;
      }
    }

    function getEvent(id) {
      return $http.get(appConfig.eventApiBase + 'event/' + id)
        .then(getEventComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for getEvent')(message);
          $location.url('/');
        });

      function getEventComplete(response) {
        return response.data;
      }
    }

    function createEvent(event) {
      return $http.post(appConfig.eventApiBase + 'event', event)
        .then(createEventComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for createEvent')(message);
          $location.url('/');
        });

      function createEventComplete(response) {
        return response.data;
      }
    }

    function updateEvent(event) {
      var urlTail = '/event/' + event.id;
      return $http.put(appConfig.eventApiBase + 'event/' + event.id, event)
        .then(updateEventComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for updateEvent')(message);
          $location.url('/');
        });

      function updateEventComplete(response) {
        return response.data;
      }
    }

    function deleteEvent(id) {
      return $http.delete(appConfig.eventApiBase + 'event/' + id)
        .then(deleteEventComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for deleteEvent')(message);
          $location.url('/');
        });

      function deleteEventComplete(response) {
        return response.data;
      }
    }

    // User

    function getUser(id) {
      return $http.get(appConfig.todoApiBase + 'user/' + id)
        .then(getUserComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for getUser')(message);
          $location.url('/');
        });

      function getUserComplete(response) {
        return response.data;
      }
    }
  }
})();
