(function ()
{
    'use strict';

    angular
        .module('app.auth.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController(AuthService, api, $httpParamSerializer, $mdToast, $state, $log)
    {
      var vm = this;

      // Data
      vm.form = {
        userType:'SELF',
        accountType: 'BUSINESS',
        username: ''
      };

      // Methods
      vm.createAccount = createAccount;
      vm.successfulSignUp = successfulSignUp;
      vm.showErrorOnToast = showErrorOnToast;

      //Create Account
      function createAccount() {
        vm.form.username = vm.form.email;

        api.userSignup.newUser(vm.form,
          function (response) {
            // Success
            successfulSignUp();

            $log.info("Successful signup");

            //Go to Login
            $state.go('app.auth_login');
          },
          function (response) {
            // Failure
            showErrorOnToast();

            $log.info("Failed to signup");

            vm.form = {};
          }
        );
      }

      function successfulSignUp() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Account created successfully. Enjoy using BrillantPay!')
            .position('top right')
            .hideDelay(4000)
        );
      }

      function showErrorOnToast() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('There was an error creating account. Please try again!')
            .position('top right')
            .hideDelay(4000)
        );
      }
    }
})();
