(function () {
  'use strict';

  var core = angular.module('app.core');

  //--
  core.config(toastrConfig);

  toastrConfig.$inject = ['toastr'];
  /* @ngInject */
  function toastrConfig(toastr) {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';
  }

  //--
  var config = {
    appErrorPrefix: '[Todo List Error] ',
    appTitle: 'Todo List'
  };

  core.value('config', config);

  //--
  core.config(configure);

  configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider'];
  /* @ngInject */
  function configure($logProvider, routerHelperProvider, exceptionHandlerProvider) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });
  }

  //--
  core.config(azync);

  azync.$inject = ['$httpProvider'];
  /* @ngInject */
  function azync($httpProvider) {
    $httpProvider.useApplyAsync(true);
  }
})();
