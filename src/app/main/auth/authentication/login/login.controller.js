(function ()
{
  'use strict';

  angular
    .module('app.auth.login')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController(AuthService, localStorageService, $state, $mdToast, $log) {

    var vm = this;
    vm.isLoading = true;

    // Data

    // Methods
    vm.clientLogin = clientLogin;
    vm.showErrorOnToast = showErrorOnToast;

    /////////////////////////////////////////////////////////

    /**
     * Client Login
     */
    function clientLogin() {
      vm.isLoading = true;

      AuthService.login(vm.email, vm.password,
        function (results) {

          if (results && AuthService.loggedIn) {

            //if the promise executed successfully and we have the user as logged in we can redirect to the dashboard
            vm.isLoginPage = window.location.href.indexOf("/login") !== -1;
            vm.theToken = localStorageService.get("AT");
            vm.permissions = localStorageService.get('PMS');
            vm.livemode = localStorageService.get("LMOD");

            // User Login redirect
            if (vm.isLoginPage && vm.theToken && vm.livemode === false) {

              // Go to Test Environment
              $state.go('app.dashboards_project');
              vm.isLoading = true;
            } else
            if (vm.isLoginPage && vm.theToken && vm.livemode === true) {

              // Go to dashboard
              if (vm.permissions === [
                  "VIEW_MODULE_TRANSACTIONS", "VIEW_MODULE_REPORTS", "VIEW_MODULE_DASHBOARDS", "VIEW_MODULE_WELCOME"
                ]) {

                // Go to client dashboard
                $state.go('app.dashboards_project');
                vm.isLoading = true;
              }
              else
              // Admin Login redirect
              if (vm.permissions === [
                  "DEACTIVATE_ACTOR", "DEACTIVATE_ROLE", "READ_ROLES", "VIEW_MODULE_DASHBOARDS", "READ_ACTORS", "UPDATE_ACTOR",
                  "VIEW_MODULE_ADMIN", "UPDATE_ROLE", "DELETE_ROLE", "CREATE_ROLE", "DELETE_ACTOR", "VIEW_MODULE_WELCOME",
                  "CREATE_ACTOR", "VIEW_MODULE_TRANSACTIONS", "READ_PRIVILEGES", "VIEW_MODULE_REPORTS", "READ_INSTITUTION_ROLES"
                ]) {

                // Go to admin dachboard
                $state.go('app.admin_dashboards_project');
                vm.isLoading = true;
              }
            }
          } else {

            if (AuthService.errorMessages.data.error_description === 'User is disabled') {

              // Resend activation email
              $state.go('app.auth_resend-confirm');
              vm.isLoading = true;
            } else if (AuthService.errorMessages.data.error_description === 'Bad credentials') {

              //Show error messages
              vm.isLoading = false;
              showErrorOnToast('Email or password is invalid.');
            } else if (!AuthService.errorMessages.data.userMessage) {

              //Show error messages
              vm.isLoading = false;
              showErrorOnToast('Error in connection. Please try again shortly');
            } else {
              //Show error messages
              vm.isLoading = false;
              showErrorOnToast(AuthService.errorMessages.data.error_description);
            }
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
  }
})();
