(function ()
{
  'use strict';

  angular
    .module('app.users.settings',
      [
        // 3rd Party Dependencies
        'xeditable',
        'credit-cards',
        'ngIdle'
      ]
    )
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, KeepaliveProvider, IdleProvider)
  {
    // State
    $stateProvider.state('app.settings', {
      url      : '/settings',
      views    : {
        'content@app': {
          templateUrl: 'app/main/users/settings/settings.html',
          controller : 'SettingsController as vm'
        }
      },
      bodyClass: 'settings'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/users/settings');

    // Api
    msApiProvider.setBaseUrl('http://dashboard.brillantpay.com:8080/api/v1/');

    msApiProvider.register('users.settings.account', ['users/:userPublicId', {userPublicId: '@userPublicId'}, {'get': {method: 'GET'}}]);
    msApiProvider.register('users.settings.banks', ['users/:userPublicId/bankAccounts', {userPublicId: '@userPublicId'}, {'get': {method: 'GET'}}]);
    msApiProvider.register('users.settings.banks.remove', ['bankAccounts/:publicId', {publicId: '@publicId'}, {'remove': {method: 'DELETE'}}]);
    msApiProvider.register('users.settings.api', ['users/:userPublicId/apiKeys', {userPublicId: '@userPublicId'}, {'get': {method: 'GET', isArray: true}}]);

    // Idle Timeout
    IdleProvider.idle(300);
    IdleProvider.timeout(0);
    KeepaliveProvider.interval(300);
  }
})();
