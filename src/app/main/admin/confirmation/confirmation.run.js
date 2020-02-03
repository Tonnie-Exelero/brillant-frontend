/**
 * Created by TONNIE on 6/12/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.admin-confirmation')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $location, AuthService, PermPermissionStore, Idle) {

    // Check whether user has the right permissions to view
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {

      if (!AuthService.loggedIn && !PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
          /*"DEACTIVATE_CLIENTS",
          "READ_CLIENTS",
          "UPDATE_CLIENTS",
          "VIEW_AS_ADMIN",
          "VIEW_MODULE_ADMIN_CLIENTS",
          "DELETE_CLIENTS",
          "CREATE_CLIENTS",
          "VIEW_MODULE_TRANSACTIONS",
          "READ_PRIVILEGES",
          "READ_INSTITUTION_ROLES"*/
          ])) {

        // Go to login
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

