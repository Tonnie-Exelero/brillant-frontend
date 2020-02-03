(function ()
{
  'use strict';

  angular
    .module('app.users', [
      'app.users.profile',
      'app.users.forms',
      'app.users.settings'
    ])
    .config(config);

  /** @ngInject */
  function config()
  {

    // Stuff here

  }
})();
