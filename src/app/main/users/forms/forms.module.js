(function ()
{
  'use strict';

  angular
    .module('app.users.forms', [
      'credit-cards',
      'ngIdle'
    ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, KeepaliveProvider, IdleProvider, msApiProvider)
  {
    $stateProvider.state('app.users_forms', {
      url      : '/account-information',
      views    : {
        'content@app': {
          templateUrl: 'app/main/users/forms/forms.html',
          controller : 'FormsController as vm'
        }
      },
      bodyClass: 'forms'
    });

    // Idle Timeout
    IdleProvider.idle(300);
    IdleProvider.timeout(0);
    KeepaliveProvider.interval(300);

    // API
    msApiProvider.setBaseUrl('http://dashboard.brillantpay.com:8080/api/v1/');

    msApiProvider.register('users.forms.industries', ['industries', {}, {'get': {method: 'GET', isArray: true}}]);
    msApiProvider.register('users.forms.countries', ['countries', {}, {'get': {method: 'GET'}}]);
  }
})();
