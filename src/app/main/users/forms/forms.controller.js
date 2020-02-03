(function ()
{
  'use strict';

  angular
    .module('app.users.forms')
    .controller('FormsController', FormsController);

  /** @ngInject */
  function FormsController(api, $state, localStorageService, $log, Idle, Keepalive, $scope, msApi, $mdToast)
  {
    var vm = this;

    // Data
    vm.currentUser = localStorageService.get('publicId');
    vm.horizontalStepper = {};

    vm.network_provider = ('SAFARICOM AIRTEL ORANGE ' +
    'MTN ETISALAT ' +
    'VODACOM TIGO').split(' ').map(function (state)
    {
      return {abbrev: state};
    });

    vm.getIndustries = getIndustries;
    function getIndustries() {
      msApi.request('users.forms.industries@get', {}).then(
        function (response) {
          vm.industries = response;
        },
        function (response) {

        }
      );
    }

    vm.getCountries = getCountries;
    function getCountries() {
      msApi.request('users.forms.countries@get', {size: 1000}).then(
        function (response) {
          vm.countries = response.content;
        },
        function (response) {
          vm.countries = [
            {}
          ];
        }
      );
    }

    // Methods
    vm.sendForm = sendForm;

    ///////////////////////////////////////////////////////

    init();

    function init() {
      getIndustries();
      getCountries();
    }

    /**
     * Do something when idle
     */
    $scope.started = true;

    $scope.$on('IdleStart', function() {
      $state.go('app.auth_lock');
    });

    $scope.$on('IdleEnd', function() {
      // Something here
    });

    $scope.$on('IdleTimeout', function() {
      $state.go('app.auth_lock');
    });

    $scope.start = function() {
      Idle.watch();
      $scope.started = true;
    };

    $scope.stop = function() {
      Idle.unwatch();
      $scope.started = false;
    };

    /**
     * Send user update
     */
    function sendForm() {

      api.users.kyc.update({userPublicId: vm.currentUser}, vm.horizontalStepper,
        //success
        function (response) {
          toastNotification("Account activated successfully");

          // Change cookie to reflect new status
          localStorageService.remove('livemode');
          localStorageService.set('livemode', response.liveMode);

          //Go to profile
          $state.go('app.settings');
        },
        //On error
        function (response) {
          console.error("It seems there was a problem submitting your details. Please try again");
          toastNotification("It seems there was a problem submitting your details. Please try again");

          //Clear data
          vm.horizontalStepper = {};
        }
      );
      //Clear data
      vm.horizontalStepper = {};
    }

    function toastNotification(data) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(data)
          .position('top right')
          .hideDelay(5000)
      );
    }
  }
})();
