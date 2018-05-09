(function () {
  'use strict';

  angular
    .module('app.events')
    .controller('EventsCtrl', EventsCtrl);

  EventsCtrl.$inject = ['$q', 'dataService', 'logger', 'groups'];
  /* @ngInject */
  function EventsCtrl($q, dataService, logger, groups) {
    var vm = this;
    vm.title = 'Event List';
    vm.loading = false;
    vm.events = [];
    vm.selectedDesc = null;
    vm.add = add;
    vm.update = update;
    vm.remove = remove;
    vm.editSwitch = editSwitch;

    vm.editingInProgress = false;
    vm.tmpEvent = {
      description: '',
      id: 0
    };

    activate();

    ////////////////////

    function activate() {
      vm.loading = true;
      var promises = [getEvents()];
      return $q.all(promises).then(function () {
        logger.info('Activated Events View');
        vm.loading = false;
      });
    }

    function getEvents() {
      dataService.getAllEvent().then(function (data) {
        vm.events = data;
        console.log('Events: ' + angular.toJson(vm.events));
        return vm.events;
      });
    }

    function editSwitch(event) {
      event.edit = !event.edit;
      if (event.edit) {
        vm.tmpEvent.description = event.description;
        vm.tmpEvent.id = event.id;
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
        dataService.createEvent(item).then(function (data) {
          if (data) {
            vm.events.push(data);
            vm.selectedDesc = null;
            logger.success(data.name + ' added', data, 'Success');
          }
        });
      } else {
        logger.warning('Name + Team + Faction required', null, 'Invalid Inputs');
      }
    }

    function update(index) {
      var target = angular.copy(vm.events[index]);
      target.description = vm.tmpEvent.description;
      target.edit = undefined;
      console.log('>> updating ...' + angular.toJson(target));
      console.log('>> from ...' + angular.toJson(vm.tmpEvent));
      dataService.updateEvent(target).then(function (data) {
        vm.events[index] = data;
        vm.editingInProgress = false;
        logger.success('Event ' + data.id + ' updated', data, 'Success');
        return vm.events;
      });
    }

    function remove(index) {
      var event = vm.events[index];
      dataService.deleteEvent(event.id).then(function (data) {
        vm.events.splice(index, 1);
        logger.info('Event ' + event.id + ' removed', data, 'Success');
        return vm.events;
      });
    }
  }
})();
