(function ()
{
  'use strict';

  angular
    .module('app.auth.resend-confirm', [
      'app.auth.login'
    ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
  {
    // State
    $stateProvider.state('app.auth_resend-confirm', {
      url      : '/resend-confirm',
      views    : {
        'main@'                                 : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.auth_resend-confirm': {
          templateUrl: 'app/main/auth/authentication/register/resend-confirm/resend-confirm.html',
          controller : 'ResendConfirmController as vm'
        }
      },

      bodyClass: 'resend-confirm'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/auth/authentication/register/resend-confirm');
  }
})();
