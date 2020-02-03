/**
 * Created by TONNIE on 5/9/2017.
 */
(function ()
{
  'use strict';

  angular
    .module('app.admin', [
      'app.administration',
      'app.admin-clients',
      'app.admin-confirmation',
      'app.admin-dashboards'
    ])
    .config(config);

  /** @ngInject */
  function config()
  {

    // Content here

  }
})();
