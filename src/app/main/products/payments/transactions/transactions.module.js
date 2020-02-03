(function ()
{
  'use strict';

  angular
    .module('app.payments-transactions',
      [
        // 3rd Party Dependencies
        'datatables',
        'flow',
        'nvd3',
        'textAngular',
        'uiGmapgoogle-maps',
        'xeditable',
        'ngIdle'
      ]
    )
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, KeepaliveProvider, IdleProvider)
  {
    // State
    $stateProvider
      .state('app.payments', {
        abstract: true,
        url     : '/payments'
      })
      .state('app.payments.transactions', {
        url      : '/transactions',
        views    : {
          'content@app': {
            templateUrl: 'app/main/products/payments/transactions/views/transactions.html',
            controller : 'TransactionsController as vm'
          }
        },
        bodyClass: 'transactions'
      });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/products/payments/transactions');

    // Api
    msApiProvider.setBaseUrl('http://dashboard.brillantpay.com:8080/api/v1/');

    msApiProvider.register('products.payments.transactions', ['transactions?payeePublicId=:userPublicId', {userPublicId:'@userPublicId'}, {'get': {method: 'GET'}}]);
    msApiProvider.register('products.payments.transactions.apiKeys', ['users/:userPublicId/apiKeys', {userPublicId: '@userPublicId'}, {'get': {method: 'GET', isArray: true}}]);

    // Idle Timeout
    IdleProvider.idle(300);
    IdleProvider.timeout(0);
    KeepaliveProvider.interval(300);
  }
})();
