(function ()
{
    'use strict';

    angular
        .module('app.auth.reset-password')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController(api, $httpParamSerializer, $state)
    {
      var vm = this;

      // Data
      vm.form = {};

      // Methods
      vm.resetSubmit = resetSubmit;

      //Forgot Submit
      function resetSubmit() {

        vm.form = $httpParamSerializer(vm.form);

        api.auth.resetPass.update(vm.form,
          function (response) {
            console.log("Your password has been reset.");

            $state.go('app.auth_login');
          },
          function (response) {
            console.error("There was a problem. Please try again.");
            vm.form = {};
          }
        )
      }
    }
})();
