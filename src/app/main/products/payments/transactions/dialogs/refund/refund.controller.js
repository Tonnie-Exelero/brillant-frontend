(function ()
{
  'use strict';

  angular
    .module('app.payments-transactions')
    .controller('RefundDialogController', RefundDialogController);

  /** @ngInject */
  function RefundDialogController($mdDialog, Refund, Refunds, event)
  {
    var vm = this;

    // Data
    vm.title = 'Refund payment';
    vm.refund = angular.copy(Refund);
    vm.refunds = Refunds;
    vm.newRefund = false;

    vm.maxAmount = vm.refund.amount;

    if ( !vm.refund )
    {
      vm.refund = {
        'publicId'          : '',
        'amount'            : ''
      };
      vm.title = 'Refund payment';
      vm.newRefund = true;
    }

    // Methods
    vm.addNewRefund = addNewRefund;
    vm.saveRefund = saveRefund;
    vm.refundPayment = refundPayment;
    vm.deleteRefund = deleteRefund;
    vm.closeDialog = closeDialog;

    //////////

    /**
     * Add new rate
     */
    function addNewRefund()
    {
      vm.refunds.push(vm.refund);

      closeDialog();
    }

    /**
     * Save rate
     */
    function saveRefund()
    {
      // Dummy save action
      for ( var i = 0; i < vm.refunds.length; i++ )
      {
        if ( vm.refunds[i].id === vm.refund.id )
        {
          vm.refunds[i] = angular.copy(vm.refund);
          break;
        }
      }

      closeDialog();
    }

    /**
     * Refund Payment
     */
    function refundPayment()
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .htmlContent('<b>' + vm.refund.currency + ' ' + vm.refund.amount + '</b>' + ' will be refunded')
        .ariaLabel('Refund payment')
        .ok('Refund')
        .cancel('Cancel')
        .targetEvent(event);

      $mdDialog.show(confirm).then(function ()
      {
        // Dummy delete action
        for ( var i = 0; i < vm.refunds.length; i++ )
        {
          if ( vm.refunds[i].publicId === vm.refund.publicId )
          {
            // Make API call here to refund
            vm.refunds[i].refunded = true;
            break;
          }
        }
      }, function ()
      {
        // Cancel Action
      });
    }

    /**
     * Delete rate
     */
    function deleteRefund()
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .content('The refund will be cancelled.')
        .ariaLabel('Remove Refund')
        .ok('Remove')
        .cancel('Cancel')
        .targetEvent(event);

      $mdDialog.show(confirm).then(function ()
      {
        closeDialog();
      }, function ()
      {
        // Cancel Action
      });
    }

    /**
     * Close dialog
     */
    function closeDialog()
    {
      $mdDialog.hide();
    }
  }
})();
