/**
 * Created by TONNIE on 6/26/2017.
 */

(function () {
  'use strict';

  angular
    .module('app.admin')
    .run(runBlock);

  /** @ngInject */
  function runBlock(PermPermissionStore, msNavigationService) {

    // Check whether user has the right permissions to view
    msNavigationService.saveItem('admin-apps', {
      title : 'ADMIN-ACCOUNT',
      group : true,
      weight: 1,
      hidden: function () {
        return !PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      /*hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "DEACTIVATE_ACTOR",
       "DEACTIVATE_ROLE",
       "READ_ROLES",
       "VIEW_MODULE_DASHBOARDS",
       "READ_ACTORS",
       "UPDATE_ACTOR",
       "VIEW_AS_ADMIN",
       "UPDATE_ROLE",
       "DELETE_ROLE",
       "CREATE_ROLE",
       "DELETE_ACTOR",
       "VIEW_MODULE_WELCOME",
       "CREATE_ACTOR",
       "VIEW_MODULE_TRANSACTIONS",
       "READ_PRIVILEGES",
       "READ_INSTITUTION_ROLES"
       ]);
       }*/
    });

    msNavigationService.saveItem('admin-apps.clients', {
      title: 'Clients',
      icon: 'icon-account-multiple',
      state: 'app.admin-clients',
      weight: 3,
      hidden: function () {
        return !PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
    });

    msNavigationService.saveItem('admin-apps.sys-admin', {
      title : 'System Administration',
      icon  : 'icon-checkbox-marked',
      state : 'app.sys-admin',
      weight: 4,
      hidden: function () {
        return !PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      /*hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "DEACTIVATE_SYSTEM_SERVICES",
       "READ_SYSTEM_SERVICES",
       "VIEW_AS_ADMIN",
       "UPDATE_SYSTEM_SERVICES",
       "CREATE_SYSTEM_SERVICES",
       "REMOVE_SYSTEM_SERVICES"
       ]);
       }*/
    });

    msNavigationService.saveItem('admin-apps.confirmation', {
      title : 'Confirmation',
      icon  : 'icon-checkbox-marked',
      state : 'app.admin-confirmation',
      weight: 5,
      hidden: function () {
        return !PermPermissionStore.hasPermissionDefinition([
          "VIEW_MODULE_ADMIN"
        ]);
      }
      /*hidden: function () {
       return !PermPermissionStore.hasPermissionDefinition([
       "DEACTIVATE_SYSTEM_SERVICES",
       "READ_SYSTEM_SERVICES",
       "VIEW_AS_ADMIN",
       "UPDATE_SYSTEM_SERVICES",
       "CREATE_SYSTEM_SERVICES",
       "REMOVE_SYSTEM_SERVICES"
       ]);
       }*/
    });
  }
})();

