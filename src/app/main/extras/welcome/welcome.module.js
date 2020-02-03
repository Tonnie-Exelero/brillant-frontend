(function ()
{
  'use strict';

  angular
    .module('app.welcome', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, msApiProvider)
  {
    // State
    $stateProvider.state('app.welcome', {
      url      : '/myaccount/welcome',
      views    : {
        'main@'                          : {
          templateUrl: 'app/core/layouts/content-only.html',
          controller : 'MainController as vm'
        },
        'content@app.welcome': {
          templateUrl: 'app/main/extras/welcome/welcome.html',
          controller : 'WelcomeController as vm'
        }
      },
      resolve : {
        Transactions: function (msApi) {
          return msApi.resolve('welcome.management@get');
        }
      },
      bodyClass: 'welcome'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/extras/welcome');

    // API
    msApiProvider.register('welcome.management', ['app/data/transactions/management/folders/selling.json']);
  }
})();
