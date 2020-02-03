/**
 * Created by TONNIE on 6/26/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.products')
    .run(runBlock);

  /** @ngInject */
  function runBlock(PermPermissionStore, msNavigationService) {

    // Check whether user has the right permissions to view
    msNavigationService.saveItem('products', {
      title : 'MY PRODUCTS',
      group : true,
      weight: 2,
      hidden: function () {
        return PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      /*hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "VIEW_AS_USER",
       "VIEW_MODULE_PRODUCTS",
       "VIEW_MODULE_PAYMENTS",
       "VIEW_MODULE_CLIENTS",
       "VIEW_MODULE_DASHBOARDS",
       "VIEW_MODULE_WALLET",
       "CREATE_PAYMENTS",
       "CREATE_CLIENTS",
       "READ_PAYMENTS",
       "READ_CLIENTS",
       "UPDATE_PAYMENTS",
       "UPDATE_CLIENTS",
       "REMOVE_PAYMENTS",
       "REMOVE_CLIENTS"
       ]);
       }*/
    });

    msNavigationService.saveItem('products.payments', {
      title : 'Payments',
      icon  : 'icon-cash-multiple',
      state: 'app.payments.transactions',
      weight: 1,
      hidden: function () {
        return PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      /*hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "VIEW_AS_USER",
       "VIEW_MODULE_PRODUCTS",
       "VIEW_MODULE_PAYMENTS",
       "VIEW_MODULE_CLIENTS",
       "VIEW_MODULE_DASHBOARDS",
       "CREATE_PAYMENTS",
       "CREATE_CLIENTS",
       "READ_PAYMENTS",
       "READ_CLIENTS",
       "UPDATE_PAYMENTS",
       "UPDATE_CLIENTS",
       "REMOVE_PAYMENTS",
       "REMOVE_CLIENTS"
       ]);
       }*/
    });

    msNavigationService.saveItem('apps.wallet', {
      title      : 'Withdraw',
      icon       : 'icon-wallet',
      state      : 'app.wallet.threads',
      stateParams: {
        filter: 'withdraw'
      },
      weight     : 2,
      hidden: function () {
        return PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      /*hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "VIEW_MODULE_WALLET",
       "VIEW_AS_USER",
       "READ_WALLET_TRANSACTIONS",
       "CREATE_WALLET_TRANSACTIONS",
       "UPDATE_WALLET_TRANSACTIONS",
       "REMOVE_WALLET_TRANSACTIONS"
       ]);
       }*/
    });
  }
})();

