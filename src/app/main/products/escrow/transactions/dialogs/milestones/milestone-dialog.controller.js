(function ()
{
  'use strict';

  angular
    .module('app.transactions')
    .controller('MilestoneDialogController', MilestoneDialogController);

  /** @ngInject */
  function MilestoneDialogController($mdDialog, Milestone, Milestones, event, msUtils)
  {
    var vm = this;

    // Data
    vm.title = 'Edit Milestone';
    vm.milestone = angular.copy(Milestone);
    vm.milestones = Milestones;
    vm.newMilestone = false;

    if ( !vm.milestone )
    {
      vm.milestone = {
        'id'                : msUtils.guidGenerator(),
        'title'             : '',
        'notes'             : '',
        'startDate'         : new Date(),
        'startDateTimeStamp': new Date().getTime(),
        'dueDate'           : '',
        'dueDateTimeStamp'  : '',
        'inspection'        : '',
        'shipping'          : '',
        'shipping_cost'     : '',
        'milestone_cost'    : '',
        'completed'         : false,
        'starred'           : false,
        'important'         : false,
        'deleted'           : false,
        'tags'              : []
      };
      vm.title = 'New Milestone';
      vm.newMilestone = true;
    }

    // Methods
    vm.addNewMilestone = addNewMilestone;
    vm.saveMilestone = saveMilestone;
    vm.deleteMilestone = deleteMilestone;
    vm.closeDialog = closeDialog;

    //////////

    /**
     * Add new milestone
     */
    function addNewMilestone()
    {
      vm.milestones.push(vm.milestone);

      closeDialog();
    }

    /**
     * Save milestone
     */
    function saveMilestone()
    {
      // Dummy save action
      for ( var i = 0; i < vm.milestones.length; i++ )
      {
        if ( vm.milestones[i].id === vm.milestones.id )
        {
          vm.milestones[i] = angular.copy(vm.milestone);
          break;
        }
      }

      closeDialog();
    }

    /**
     * Delete milestone
     */
    function deleteMilestone()
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .content('The Milestone will be deleted.')
        .ariaLabel('Delete Milestone')
        .ok('Delete')
        .cancel('Cancel')
        .targetEvent(event);

      $mdDialog.show(confirm).then(function ()
      {
        // Dummy delete action
        for ( var i = 0; i < vm.milestones.length; i++ )
        {
          if ( vm.milestones[i].id === vm.milestones.id )
          {
            vm.milestones[i].deleted = true;
            break;
          }
        }
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
