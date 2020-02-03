(function ()
{
  'use strict';

  angular
    .module('app.transactions',
      [
        // 3rd Party Dependencies
        'datatables',
        'ng-sortable',
        'textAngular'
      ])

    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
  {
    // State
    $stateProvider
      .state('app.transactions', {
        url    : '/start-a-transaction',
        views  : {
          'content@app': {
            templateUrl: 'app/main/products/escrow/transactions/transactions.html',
            controller : 'TransactionController as vm'
          }
        },
        resolve  : {
          Milestones: function (msApi)
          {
            return msApi.resolve('transactions.milestones@get');
          },
          Tags : function (msApi)
          {
            return msApi.resolve('transactions.tags@get');
          }
        },
        bodyClass: 'transactions'
      });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/products/escrow/transactions');

    // Api
    msApiProvider.register('transactions.milestones', ['app/data/transactions/milestones.json']);
    msApiProvider.register('transactions.tags', ['app/data/transactions/tags.json']);
  }
})();
