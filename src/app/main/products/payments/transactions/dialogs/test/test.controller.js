(function ()
{
  'use strict';

  angular
    .module('app.payments-transactions')
    .controller('TransactionsController', TransactionsController);

  /** @ngInject */
  function TransactionsController($mdDialog)
  {
    var vm = this;

    // Data
    vm.payload = {
      "ConfirmationCode": "LYET673VGT6367",
      "ConfirmationAccount": 567525,
      "Currency": "KES",
      "Amount": 500,
      "Description": "Chiffon blouse",
      "PaymentOption": "MOBILEMONEY",
      "PaymentService": "MPESA",
      "CustomerEmail": "john.doe@brillantpay.com",
      "CustomerPhoneNumber": 254700112233
    };

    // Method
    vm.closeDialog = closeDialog;

    /////////////////////////

    /**
     * Close dialog
     */
    function closeDialog()
    {
      $mdDialog.hide();
    }
  }
})();
