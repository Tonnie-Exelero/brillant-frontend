/**
 * Created by TONNIE on 6/27/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.auth.unauthorized')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $location, AuthService, PermPermissionStore) {

    // Check whether user has the right permissions to view
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {

      if (!AuthService.loggedIn && !PermPermissionStore.hasPermissionDefinition([
          ""
          /*"VIEW_MODULE_DASHBOARD_PROJECT",
           "VIEW_AS_USER",
           "VIEW_MODULE_TRANSACTIONS"*/
        ])) {

        // Go to login
        $location.path('/login');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
      //save the previous state in a rootScope variable so that it's accessible from everywhere
      $rootScope.previousState = from;
    });
  }
})();

