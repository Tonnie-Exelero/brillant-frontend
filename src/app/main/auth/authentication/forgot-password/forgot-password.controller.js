(function ()
{
    'use strict';

    angular
        .module('app.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController(AuthService, $mdToast, $log, $httpParamSerializer, $state, msApi)
    {
      var vm = this;

      // Data
      vm.form = {};

      // Methods
      vm.forgotSubmit = forgotSubmit;
      vm.successSubmit = successSubmit;
      vm.showErrorOnToast = showErrorOnToast;

      //Forgot Submit
      function forgotSubmit() {

        vm.form = $httpParamSerializer(vm.form);

        msApi.request('app.auth.forgot-password@save', vm.form).then(
          function (response) {
            $log.info("Successful signup");

            successSubmit();

            AuthService.clearSession();

            //Go to Login
            $state.go('app.auth_login');
          },
          function (error) {
            $log.info("Failed to submit password recovery email");

            showErrorOnToast();

            vm.form = {};
          }
        );
      }

      function successSubmit() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('New Password has been emailed to you. You can change it to your own.')
            .position('top right')
            .hideDelay(4000)
        );
      }

      function showErrorOnToast() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('There was an error submitting your email. Please try again.')
            .position('top right')
            .hideDelay(4000)
        );
      }
    }
})();
