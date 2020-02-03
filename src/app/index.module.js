(function ()
{
  'use strict';

  /**
   * Main module of the Fuse
   */
  angular
    .module('fuse', [

      // Core
      'app.core',

      // 3rd Party Dependencies
      'textAngular',
      'xeditable',
      'permission',
      'permission.ui',
      'ngclipboard',
      'LocalStorageModule',

      // Auth Service
      'app.auth.login',

      // Navigation
      'app.navigation',

      // Toolbar
      'app.toolbar',

      // Quick Panel
      'app.quick-panel',

      // Admin
      'app.admin',

      // Auth
      'app.auth',

      // Dashboards
      'app.dashboards',

      // Products
      'app.products',

      // Users
      'app.users',

      // Extras
      'app.extras'
    ]);
})();
