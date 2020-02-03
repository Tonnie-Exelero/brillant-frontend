(function ()
{
  'use strict';

  angular
    .module('app.auth.forgot-password', [
      'app.auth.login'
    ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
  {
    // State
    $stateProvider.state('app.auth_forgot-password', {
      url      : '/forgot-password',
      views    : {
        'main@'                                 : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.auth_forgot-password': {
          templateUrl: 'app/main/auth/authentication/forgot-password/forgot-password.html',
          controller : 'ForgotPasswordController as vm'
        }
      },
      bodyClass: 'forgot-password'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/auth/authentication/forgot-password');

    /*msApiProvider.setBaseUrl('http://fire.brillantpay.com:8080/api/v1/');*/

    msApiProvider.register('app.auth.forgot-password', ['forgot-password', {}, {'save': {method: 'POST'}}]);
  }
})();
