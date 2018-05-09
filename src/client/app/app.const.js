(function () {
  'use strict';

  //---
  // create an object to hold the environment settings
  var env = {};

  // import the settings from the *.env.js file and assign
  // them the the 'env' object; check that the window object
  // and __env property are devined, otherwise tests running
  if (window && window.__env) {
    Object.assign(env, window.__env);
  }
  //---

  angular.module('app')
    .constant('appConfig', env);
})();
