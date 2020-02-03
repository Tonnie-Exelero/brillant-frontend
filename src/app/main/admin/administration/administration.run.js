/**
 * Created by TONNIE on 6/12/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.administration')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $location, AuthService, PermPermissionStore, Idle) {

    // Check whether user has the right permissions to view
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {

      // Check if user is logged in and has permissions to view
      if (!AuthService.loggedIn || !PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
          /*"DEACTIVATE_SYSTEM_SERVICES",
           "READ_SYSTEM_SERVICES",
           "VIEW_AS_ADMIN",
           "UPDATE_SYSTEM_SERVICES",
           "CREATE_SYSTEM_SERVICES",
           "REMOVE_SYSTEM_SERVICES"*/
        ])) {
        // Take to login
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

