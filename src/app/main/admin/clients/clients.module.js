(function ()
{
  'use strict';

  angular
    .module('app.admin-clients',
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
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, KeepaliveProvider, IdleProvider)
  {
    // State
    $stateProvider
      .state('app.admin-clients', {
        url      : '/admin/clients',
        data: {
          permissions: {
            only: ['VIEW_MODULE_ADMIN']
          }
        },
        views    : {
          'content@app': {
            templateUrl: 'app/main/admin/clients/clients.html',
            controller : 'AdminClientsController as vm'
          }
        },
        resolve  : {
          Clients  : function (msApi)
          {
            return msApi.resolve('admin.clients@get');
          },
          Statuses: function (msApi)
          {
            return msApi.resolve('admin.clientStatuses@get');
          }
        },
        bodyClass: 'clients'
      })
      .state('app.admin-clients.client', {
        url      : '/:id',
        views    : {
          'content@app': {
            templateUrl: 'app/main/admin/clients/client/client.html',
            controller : 'ClientController as vm'
          }
        },
        resolve  : {
          Transactions  : function (msApi, $stateParams, $cookies)
          {
            var activeUser = $cookies.get('publicId');
            //return msApi.resolve('payments.transactions@get', {publicId: activeUser});
            return msApi.resolve('payments.transactions@get');
          },
          Statuses: function (msApi, $cookies)
          {
            var activeUser = $cookies.get('publicId');
            //return msApi.resolve('payments.statuses@get', {publicId: activeUser});
            return msApi.resolve('payments.statuses@get');
          },
          ApiKey: function (msApi, $cookies)
          {
            var activeUser = $cookies.get('publicId');
            //return msApi.resolve('payments.keys@get', {publicId: activeUser});
            return msApi.resolve('payments.keys@get');
          }
        },
        bodyClass: 'payments'
      })
    ;

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/admin/clients');

    // Api
    msApiProvider.register('admin.clients', ['app/data/admin/clients/clients.json']);
    msApiProvider.register('admin.clientStatuses', ['app/data/admin/clients/statuses.json']);

    msApiProvider.register('payments.transactions', ['app/data/payments/transactions.json']);
    msApiProvider.register('payments.statuses', ['app/data/payments/statuses.json']);
    msApiProvider.register('payments.keys', ['app/data/settings/api.json']);

    // Idle Timeout
    IdleProvider.idle(300);
    IdleProvider.timeout(0);
    KeepaliveProvider.interval(300);
  }
})();
