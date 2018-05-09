(function () {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap',
      'ui.bootstrap.tpls',
      'ngplus',
      'app.logging',
      'app.routing',
      'app.exceptions'
    ]);
})();
