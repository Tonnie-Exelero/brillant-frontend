/**
 * Created by TONNIE on 6/12/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.payments-transactions')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $location, AuthService, PermPermissionStore, Idle) {

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {

      if (!AuthService.loggedIn && !PermPermissionStore.hasPermissionDefinition([
        "VIEW_MODULE_TRANSACTIONS"
          /*"VIEW_AS_USER",
          "VIEW_MODULE_PRODUCTS",
          "VIEW_MODULE_PAYMENTS",
          "VIEW_MODULE_CLIENTS",
          "CREATE_PAYMENTS",
          "CREATE_CLIENTS",
          "READ_PAYMENTS",
          "READ_CLIENTS",
          "UPDATE_PAYMENTS",
          "UPDATE_CLIENTS",
          "REMOVE_PAYMENTS",
          "REMOVE_CLIENTS"*/
        ])) {

        $location.path('/login');
      }
    });

    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {

      if (error === "Not Authorized") {
        $location.path("/unauthorized");
      }
    });

    Idle.watch();
  }
})();

