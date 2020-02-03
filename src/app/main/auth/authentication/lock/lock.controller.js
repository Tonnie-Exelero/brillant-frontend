(function ()
{
    'use strict';

    angular
        .module('app.auth.lock')
        .controller('LockController', LockController);

    /** @ngInject */
    function LockController(localStorageService, $rootScope, $mdToast, $location, $state, AuthService)
    {
      var vm = this;

      // Data
      vm.email = localStorageService.get('UN');
      vm.firstName = localStorageService.get('fN');
      vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg', 'green-bg'];

      // Methods
      vm.lockSubmit = lockSubmit;
      vm.goToLogin = goToLogin;
      vm.showErrorOnToast = showErrorOnToast;

      //Lock Submit
      function lockSubmit() {

        //vm.form = $httpParamSerializer(vm.form);

        AuthService.login(vm.email, vm.password,
          function (results) {

            if (results && AuthService.loggedIn) {

              //if the promise executed successfully and we have the user as logged in we can redirect to the dashboard
              vm.theToken = localStorageService.get("AT");

              // User Login redirect
              if (vm.theToken) {

                // Go to previous state
                $state.go($rootScope.previousState.name, {
                  params: $rootScope.previousStateParams.name
                });
                vm.isLoading = true;
              }
            } else {
              //Show error messages
              vm.isLoading = false;
              showErrorOnToast(AuthService.errorMessages.data.error_description);
            }
          });
      }

      function showErrorOnToast(errorMessage) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(errorMessage)
            .position('top right')
            .hideDelay(5000)
        );
      }

      /**
       * Go to Login
       */
      function goToLogin() {
        // Clear Session
        AuthService.clearSession();

        // Go to Login
        $state.go('app.auth_login');
      }
    }
})();
