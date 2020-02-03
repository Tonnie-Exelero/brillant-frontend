(function ()
{
  'use strict';

  angular
    .module('app.auth.login', [
      //3rd Party Dependencies
      'vcRecaptcha'
    ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider)
  {
    // State
    $stateProvider.state('app.auth_login', {
      url      : '/login',
      views    : {
        'main@'                          : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.auth_login': {
          templateUrl: 'app/main/auth/authentication/login/login.html',
          controller : 'LoginController as vm'
        }
      },
      bodyClass: 'login'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/auth/authentication/login');

    // Encryption
    //$cryptoProvider.setCryptographyKey('eywgywet672632532gtd6523gd');
  }
})();
