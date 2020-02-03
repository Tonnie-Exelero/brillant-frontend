(function ()
{
  'use strict';

  angular
    .module('app.users.profile',
      [
        // 3rd Party Dependencies
        'flow',
        'ngIdle'
      ]
    )
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, KeepaliveProvider, IdleProvider)
  {
    $stateProvider.state('app.user_profile', {
      url      : '/profile',
      views    : {
        'content@app': {
          templateUrl: 'app/main/users/profile/profile.html',
          controller : 'ProfileController as vm'
        }
      },
      bodyClass: 'profile'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/users/profile');

    // Api
    msApiProvider.setBaseUrl('http://dashboard.brillantpay.com:8080/api/v1/');

    msApiProvider.register('users.profile.about', ['users/:userPublicId', {userPublicId: '@userPublicId'}, {'get': {method: 'GET'}}]);
    msApiProvider.register('users.profile.update', ['users/:userPublicId', {userPublicId: '@userPublicId'}, {'patch': {method: 'PATCH'}}]);

    // Idle Timeout
    IdleProvider.idle(300);
    IdleProvider.timeout(0);
    KeepaliveProvider.interval(300);
  }
})();
