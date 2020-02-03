/**
 * Created by TONNIE on 6/12/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.welcome')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $location, AuthService, PermPermissionStore) {

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {

      if (!AuthService.loggedIn && !PermPermissionStore.hasPermissionDefinition([
        ""
          /*"VIEW_AS_USER",
          "VIEW_MODULE_EXTRAS",
          "VIEW_MODULE_TRANSACTIONS",
          "VIEW_MODULE_DASHBOARDS",
          "VIEW_MODULE_WELCOME"*/
        ])) {

        $location.path('/login');
      }
    });

    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {

      if (error === "Not Authorized") {
        $location.path("/unauthorized");
      }
    });
  }
})();

