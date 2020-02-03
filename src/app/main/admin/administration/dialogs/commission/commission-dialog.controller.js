(function ()
{
  'use strict';

  angular
    .module('app.administration')
    .controller('CommissionDialogController', CommissionDialogController);

  /** @ngInject */
  function CommissionDialogController($mdDialog, Commission, Commissions, event)
  {
    var vm = this;

    // Data
    vm.title = 'Edit Commission';
    vm.commission = angular.copy(Commission);
    vm.commissions = Commissions;
    vm.newCommission = false;

    if ( !vm.commission )
    {
      vm.commission = {
        'id'                : '',
        'title'             : '',
        'rate'              : '',
        'charge_currency'   : '',
        'static_charge'     : '',
        'notes'             : ''
      };
      vm.title = 'New Commission';
      vm.newCommission = true;
      vm.commission.tags = [];
    }

    // Methods
    vm.addNewCommission = addNewCommission;
    vm.saveCommission = saveCommission;
    vm.deleteCommission = deleteCommission;
    vm.newTag = newTag;
    vm.closeDialog = closeDialog;

    //////////

    /**
     * Add new commission
     */
    function addNewCommission()
    {
      vm.commissions.push(vm.commission);

      closeDialog();
    }

    /**
     * Save commission
     */
    function saveCommission()
    {
      // Dummy save action
      for ( var i = 0; i < vm.commissions.length; i++ )
      {
        if ( vm.commissions[i].id === vm.commission.id )
        {
          vm.commissions[i] = angular.copy(vm.commission);
          break;
        }
      }

      closeDialog();
    }

    /**
     * Delete commission
     */
    function deleteCommission()
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .content('The Commission will be deleted.')
        .ariaLabel('Delete Commission')
        .ok('Delete')
        .cancel('Cancel')
        .targetEvent(event);

      $mdDialog.show(confirm).then(function ()
      {
        // Dummy delete action
        for ( var i = 0; i < vm.commissions.length; i++ )
        {
          if ( vm.commissions[i].id === vm.commission.id )
          {
            vm.commissions[i].deleted = true;
            break;
          }
        }
      }, function ()
      {
        // Cancel Action
      });
    }


    /**
     * New tag
     *
     * @param chip
     * @returns {{label: *, color: string}}
     */
    function newTag(chip)
    {
      var tagColors = ['#388E3C', '#F44336', '#FF9800', '#0091EA', '#9C27B0'];

      return {
        name : chip,
        label: chip,
        color: tagColors[Math.floor(Math.random() * (tagColors.length))]
      };
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
