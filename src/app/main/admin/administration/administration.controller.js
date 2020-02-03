(function ()
{
  'use strict';

  angular
    .module('app.administration')
    .controller('AdministrationController', AdministrationController);

  /** @ngInject */
  function AdministrationController($document, $mdDialog, $mdSidenav, Countries, Rates, Commission, Idle, Keepalive, $scope, $state)
  {
    var vm = this;

    // Data
    vm.countries = Countries.data;
    vm.rates = Rates.data;
    vm.commissions = Commission.data;
    vm.listType = 'countries';
    vm.filterIds = null;

    vm.dtInstance = {};
    vm.dtOptions = {
      dom         : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType  : 'simple',
      autoWidth   : false,
      responsive  : true
    };

    // Methods
    vm.filterChange = filterChange;
    vm.openCountryDialog = openCountryDialog;
    vm.openExchangeRateDialog = openExchangeRateDialog;
    vm.openCommissionDialog = openCommissionDialog;
    vm.removeCountry = removeCountry;
    vm.removeCountryConfirm = removeCountryConfirm;
    vm.toggleSidenav = toggleSidenav;

    //////////

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
     * Change Settings List Filter
     * @param type
     */
    function filterChange(type)
    {

      vm.listType = type;

      if ( type === 'countries' )
      {
        vm.filterIds = null;
      }
    }

    /**
     * Open new task dialog
     *
     * @param ev
     * @param country
     */
    function openCountryDialog(ev, country)
    {
      $mdDialog.show({
        controller         : 'CountryDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/admin/administration/dialogs/countries/countries-dialog.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          Country : country,
          Countries: vm.countries,
          event: ev
        }
      });
    }

    /**
     * Open new task dialog
     *
     * @param ev
     * @param rate
     */
    function openExchangeRateDialog(ev, rate)
    {
      $mdDialog.show({
        controller         : 'ExchangeRateDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/admin/administration/dialogs/exchange/exchangerate-dialog.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          Rate : rate,
          Rates: vm.rates,
          event: ev
        }
      });
    }

    /**
     * Open new task dialog
     *
     * @param ev
     * @param commission
     */
    function openCommissionDialog(ev, commission)
    {
      $mdDialog.show({
        controller         : 'CommissionDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/admin/administration/dialogs/commission/commission-dialog.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          Commission : commission,
          Commissions: vm.commission,
          event: ev
        }
      });
    }

    /**
     * Remove Country
     *
     * @param country
     */
    function removeCountry(country)
    {
      vm.countries.splice(vm.countries.indexOf(country), 1);
    }

    /**
     * Confirm Country Removal
     */
    function removeCountryConfirm(country, ev)
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the country?')
        .htmlContent('<b>' + country.title + '</b>' + ' will be deleted.')
        .ariaLabel('delete country')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        removeCountry(country);

      }, function ()
      {

      });
    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId)
    {
      $mdSidenav(sidenavId).toggle();
    }
  }
})();
