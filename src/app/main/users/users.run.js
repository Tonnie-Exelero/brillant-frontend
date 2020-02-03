/**
 * Created by TONNIE on 6/26/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.users')
    .run(runBlock);

  /** @ngInject */
  function runBlock(PermPermissionStore, msNavigationService) {

    // Check whether user has the right permissions to view
    msNavigationService.saveItem('user', {
      title : 'MANAGE',
      group : true,
      weight: 3,
      hidden: function () {
        return PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      /*hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "VIEW_AS_USER",
       "VIEW_MODULE_EXTRAS",
       "VIEW_MODULE_TRANSACTIONS",
       "VIEW_MODULE_DASHBOARDS",
       "VIEW_MODULE_WELCOME"
       ]);
       }*/
    });

    msNavigationService.saveItem('user.settings', {
      title : 'Settings',
      icon  : 'icon-cog',
      state : 'app.settings',
      weight: 2,
      hidden: function () {
        return PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      /*hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "VIEW_AS_USER",
       "VIEW_MODULE_USER_SETTINGS"
       ]);
       }*/
    });

    /*msNavigationService.saveItem('user.profile', {
      title : 'Profile',
      icon  : 'icon-account',
      state : 'app.user_profile',
      weight: 3,
      hidden: function () {
        return PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "VIEW_AS_USER",
       "VIEW_MODULE_USER_SETTINGS"
       ]);
       }
    });*/
  }
})();

