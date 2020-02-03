/**
 * Created by TONNIE on 6/12/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.users.profile')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $location, AuthService, PermPermissionStore, Idle) {

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {

      if (!AuthService.loggedIn) {

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

