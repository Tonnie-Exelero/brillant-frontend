(function ()
{
  'use strict';

  angular
    .module('app.auth.register', [
      // 3rd Party Dependencies
      'ngPassword',
      'vcRecaptcha'
    ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
  {
    // State
    $stateProvider.state('app.auth_register', {
      url      : '/register',
      views    : {
        'main@'                          : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.auth_register': {
          templateUrl: 'app/main/auth/authentication/register/register.html',
          controller : 'RegisterController as vm'
        }
      },
      bodyClass: 'register'
    });

    // Translate
    $translatePartialLoaderProvider.addPart('app/main/auth/authentication/register');

    /*msApiProvider.setBaseUrl('http://fire.brillantpay.com:8080/api/v1/');*/

    msApiProvider.register('app.auth.register', ['uaa/users/register', {}, {'save': {method: 'POST'}}]);
  }
})();
