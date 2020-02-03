(function ()
{
  'use strict';

  angular
    .module('app.welcome')
    .controller('WelcomeController', WelcomeController);

  /** @ngInject */
  function WelcomeController(AuthService, $state, Transactions) {

    var vm = this;
    vm.isLoading = false;

    // Data
    vm.transactions = Transactions.data;

    // Methods
    vm.goToInvoices = goToInvoices;
    vm.goToDashboard = goToDashboard;
    vm.logout = logout;
    vm.manageTransactions = manageTransactions;
    vm.addPaymentMethod = addPaymentMethod;
    vm.withdrawFunds = withdrawFunds;

    ////////////

    /**
     * Go To Invoices
     */
    function goToInvoices() {
      $state.go('app.management.threads', {type: 'label', filter: 'invoices'});
    }

    /**
     * Go To Wallet
     */
    function goToDashboard() {
      $state.go('app.wallet.threads', {filter: 'deposit'});
    }

    /**
     * Log Out
     */
    function logout() {
      AuthService.clearSession();

      $state.go('app.auth_login-v2');
    }

    /**
     * Manage Transactions
     */
    function manageTransactions() {
      $state.go('app.management.threads', {filter: 'selling'});
    }

    /**
     * Add Payment Methods
     */
    function addPaymentMethod() {
      $state.go('app.settings');
    }

    /**
     * Withdraw funds
     */
    function withdrawFunds() {
      $state.go('app.wallet.threads', {filter: 'withdraw'});
    }
  }
})();
