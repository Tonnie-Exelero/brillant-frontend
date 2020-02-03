(function ()
{
  'use strict';

  angular
    .module('app.administration',
      [
        // 3rd Party Dependencies
        'datatables',
        'ng-sortable',
        'textAngular',
        'ngIdle'
      ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, KeepaliveProvider, IdleProvider)
  {
    // State
    $stateProvider.state('app.sys-admin', {
      url      : '/admin/system-administration',
      data: {
        permissions: {
          only: ['VIEW_MODULE_ADMIN']
        }
      },
      views    : {
        'content@app': {
          templateUrl: 'app/main/admin/administration/administration.html',
          controller : 'AdministrationController as vm'
        }
      },
      resolve  : {
        Countries: function (msApi)
        {
          return msApi.resolve('admin.countries@get');
        },
        Rates : function (msApi)
        {
          return msApi.resolve('admin.rates@get');
        },
        Commission : function (msApi)
        {
          return msApi.resolve('admin.commission@get');
        }
      },
      bodyClass: 'todo'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/admin/administration');

    // Api
    msApiProvider.register('admin.countries', ['app/data/admin/administration/countries.json']);
    msApiProvider.register('admin.rates', ['app/data/admin/administration/rates.json']);
    msApiProvider.register('admin.commission', ['app/data/admin/administration/commission.json']);

    // Idle Timeout
    IdleProvider.idle(300);
    IdleProvider.timeout(0);
    KeepaliveProvider.interval(300);
  }
})();
