/**
 * Created by TONNIE on 5/31/2017.
 */
(function ()
{
  'use strict';

  angular
    .module('app.auth', [
      'app.auth.login',
      'app.auth.register',
      'app.auth.resend-confirm',
      'app.auth.forgot-password',
      'app.auth.reset-password',
      'app.auth.lock',
      'app.auth.unauthorized'
    ])
    .config(config);

  /** @ngInject */
  function config()
  {

    // Stuff come here

  }
})();
