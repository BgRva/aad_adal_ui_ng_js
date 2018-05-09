(function () {
  'use strict';

  angular
    .module('app.todos')
    .controller('TodosCtrl', TodosCtrl);

  TodosCtrl.$inject = ['$q', 'dataService', 'logger', 'groups'];
  /* @ngInject */
  function TodosCtrl($q, dataService, logger, groups) {
    var vm = this;
    vm.title = 'Todo List';
    vm.loading = false;
    vm.todos = [];
    vm.selectedDesc = null;
    vm.add = add;
    vm.update = update;
    vm.remove = remove;
    vm.editSwitch = editSwitch;

    vm.editingInProgress = false;
    vm.tmpTodo = {
      description: '',
      id: 0
    };

    activate();

    ////////////////////

    function activate() {
      vm.loading = true;
      var promises = [getTodos()];
      return $q.all(promises).then(function () {
        logger.info('Activated Todos View');
        vm.loading = false;
      });
    }

    function getTodos() {
      dataService.getAllTodo().then(function (data) {
        vm.todos = data;
        console.log('Todos: ' + angular.toJson(vm.todos));
        return vm.todos;
      });
    }

    function editSwitch(todo) {
      todo.edit = !todo.edit;
      if (todo.edit) {
        vm.tmpTodo.description = todo.description;
        vm.tmpTodo.id = todo.id;
        vm.editingInProgress = true;
      } else {
        vm.editingInProgress = false;
      }
    }

    function add() {
      if (vm.selectedDesc) {
        var item = {
          description: vm.selectedDesc,
          team: 'Goons',
          faction: 'Horde',
          owner: 'Barney Rubble'
        };
        dataService.createTodo(item).then(function (data) {
          vm.todos.push(data);
          vm.selectedDesc = null;
          logger.success(data.name + ' added', data, 'Success');
          return vm.todos;
        });
      } else {
        logger.warning('Name + Team + Faction required', null, 'Invalid Inputs');
      }
    }

    function update(index) {
      var target = angular.copy(vm.todos[index]);
      target.description = vm.tmpTodo.description;
      target.edit = undefined;
      console.log('>> updating ...' + angular.toJson(target));
      console.log('>> from ...' + angular.toJson(vm.tmpTodo));
      dataService.updateTodo(target).then(function (data) {
        vm.todos[index] = data;
        vm.editingInProgress = false;
        logger.success('Todo ' + data.id + ' updated', data, 'Success');
        return vm.todos;
      });
    }

    function remove(index) {
      var todo = vm.todos[index];
      dataService.deleteTodo(todo.id).then(function (data) {
        vm.todos.splice(index, 1);
        logger.info('Todo ' + todo.id + ' removed', data, 'Success');
        return vm.todos;
      });
    }
  }
})();
