/**
 * Created by TONNIE on 12/25/2016.
 */
(function ()
{
  'use strict';

  angular
    .module('app.trans', [
      'app.transactions',
      'app.management',
      'app.invoice'
    ])
    .config(config);

  /** @ngInject */
  function config(msNavigationServiceProvider)
  {
    // Navigation
    /*msNavigationServiceProvider.saveItem('trans', {
      title : 'ESCROW TRANSACTIONS',
      group : true,
      weight: 4
    });

    msNavigationServiceProvider.saveItem('trans.transactions', {
      title    : 'Start a transaction',
      icon     : 'icon-cash-multiple',
      state    : 'app.transactions',
      weight   : 1
    });

    msNavigationServiceProvider.saveItem('trans.management', {
      title      : 'Manage Transactions',
      icon       : 'icon-link-variant',
      state      : 'app.management.threads',
      stateParams: {
        filter: 'selling'
      },
      weight     : 2
    });*/
  }
})();
