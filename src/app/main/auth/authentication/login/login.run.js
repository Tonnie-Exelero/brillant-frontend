/**
 * Created by TONNIE on 5/8/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.auth.login')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, localStorageService, $http, PermPermissionStore) {

    /**
     * Event listener to wire back the oauth-token back to the $http header
     */

    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {

      // track the state the user wants to go to; authorization service needs this
      PermPermissionStore.clearStore();
      var localStorage = localStorageService;
      var access_token = angular.fromJson(localStorage.get('AT'));
      var userPermissions = angular.fromJson(localStorage.get('PMS'));

      /**
       * check if we have permissions define in the auth service since its our first priority for checking user permissions
       * and then fallback to cookies to get the user permissions
       */
      if (userPermissions && access_token ) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + access_token ;
        PermPermissionStore.defineManyPermissions(userPermissions, /*@ngInject*/ function (permissionName) {
          return _.includes(userPermissions, permissionName);
        });
      }else {

        // Something here
      }
    });
  }
})();

