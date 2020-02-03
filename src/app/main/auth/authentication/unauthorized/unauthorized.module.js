(function ()
{
  'use strict';

  angular
    .module('app.auth.unauthorized', [
      'app.auth.login'
    ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
  {
    // State
    $stateProvider.state('app.auth_unauthorized', {
      url      : '/unauthorized',
      views    : {
        'main@'                                 : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.auth_unauthorized': {
          templateUrl: 'app/main/auth/authentication/unauthorized/unauthorized.html',
          controller : 'UnauthorizedController as vm'
        }
      },
      bodyClass: 'unauthorized'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/auth/authentication/unauthorized');

    /*msApiProvider.setBaseUrl('http://fire.brillantpay.com:8080/api/v1/');*/

    msApiProvider.register('app.auth.unauthorized', ['unauthorized', {}, {'save': {method: 'POST'}}]);
  }
})();
