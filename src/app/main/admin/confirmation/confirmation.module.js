(function ()
{
  'use strict';

  angular
    .module('app.admin-confirmation',
      [
        // 3rd Party Dependencies
        'datatables',
        'textAngular',
        'xeditable',
        'ngIdle'
      ]
    )
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, KeepaliveProvider, IdleProvider)
  {
    // State
    $stateProvider
      .state('app.admin-confirmation', {
        url      : '/admin/transaction-confirmation',
        data: {
          permissions: {
            only: ['VIEW_MODULE_ADMIN']
          }
        },
        views    : {
          'content@app': {
            templateUrl: 'app/main/admin/confirmation/confirmation.html',
            controller : 'AdminConfirmationController as vm'
          }
        },
        bodyClass: 'confirmation'
      });

    // API
    msApiProvider.setBaseUrl('http://dashboard.brillantpay.com:8080/api/v1/');
    // msApiProvider.setBaseUrl('app/data/');

    msApiProvider.register('admin.confirmation.payments.pending', ['transactions', {}, {'get': {method: 'GET'}}]);
    // msApiProvider.register('admin.confirmation.payments.pending', ['transactions/data.json', {}, {'get': {method: 'GET'}}]);

    // Idle Timeout
    IdleProvider.idle(300);
    IdleProvider.timeout(0);
    KeepaliveProvider.interval(300);
  }
})();
