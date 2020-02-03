(function ()
{
  'use strict';

  angular
    .module('app.auth.resend-confirm')
    .controller('ResendConfirmController', ResendConfirmController);

  /** @ngInject */
  function ResendConfirmController($state, $log, $mdToast, api, $cookies)
  {
    var vm = this;

    // Data
    vm.currentUser = $cookies.get('publicId');
    vm.form = {};

    // Methods
    vm.submitConfirmation = submitConfirmation;

    /////////////////////////////////////////////////

    //Forgot Submit
    function submitConfirmation() {

      api.users.resend_confirm.get({email: vm.form.email},
        function (response) {
          $log.info("Activation email successfully sent");

          successSubmit();

          //Go to Login
          $state.go('app.auth_login');
        },
        function (error) {
          $log.info("Failed to send email");

          showErrorOnToast();
        }
      );
    }

    function successSubmit() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Activation email successfully sent.')
          .position('top right')
          .hideDelay(4000)
      );
    }

    function showErrorOnToast() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('There was an error sending the email. Please try again.')
          .position('top right')
          .hideDelay(4000)
      );
    }
  }
})();
