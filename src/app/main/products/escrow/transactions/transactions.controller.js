(function ()
{
  'use strict';

  angular
    .module('app.transactions')
    .controller('TransactionController', TransactionController);

  /** @ngInject */
  function TransactionController($scope, api, $httpParamSerializer, $state, $mdDialog, $document, Milestones, Tags)
  {
    var vm = this;

    // Data
    //vm.milestones = Milestones.data;
    vm.tags = Tags.data;
    vm.milestones = [];
    vm.transaction = {};
    vm.transaction.milestones = vm.milestones;
    vm.network_provider = ('SAFARICOM AIRTEL ORANGE ' +
    'MTN ETISALAT ' +
    'VODACOM TIGO').split(' ').map(function (state)
    {
      return {abbrev: state};
    });

    // Methods
    vm.submitTransaction = submitTransaction;
    vm.sendForm = sendForm;
    vm.openMilestoneDialog = openMilestoneDialog;
    vm.cancelMilestone = cancelMilestone;
    vm.cancelMilestoneConfirm = cancelMilestoneConfirm;

    init();

    //////////

    /**
     * Initialize the controller
     */
    function init()
    {
      angular.forEach(vm.milestones, function (milestone)
      {
        if ( milestone.startDate )
        {
          milestone.startDate = new Date(milestone.startDate);
          milestone.startDateTimestamp = milestone.startDate.getTime();
        }

        if ( milestone.dueDate )
        {
          milestone.dueDate = new Date(milestone.dueDate);
          milestone.dueDateTimestamp = milestone.dueDate.getTime();
        }
      });
    }

    /**
     * Open new milestone dialog
     *
     * @param ev
     * @param milestone
     */
    function openMilestoneDialog(ev, milestone)
    {
      $mdDialog.show({
        controller         : 'MilestoneDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/products/escrow/transactions/dialogs/milestones/milestone-dialog.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          Milestone : milestone,
          Milestones: vm.milestones,
          event: ev
        }
      });
    }

    /**
     * Cancel Milestone
     *
     * @param milestone
     */
    function cancelMilestone(milestone)
    {
      vm.milestones.splice(vm.milestones.indexOf(milestone), 1);
    }

    /**
     * Confirm Milestone Cancel
     */
    function cancelMilestoneConfirm(milestone, ev)
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the milestone?')
        .htmlContent('<b>' + milestone.title + '</b>' + ' will be deleted.')
        .ariaLabel('delete milestone')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        cancelMilestone(milestone);

      }, function ()
      {

      });
    }

    //Submit Transaction
    function submitTransaction() {
      vm.moreData = {
        "ongoing": true,
        "read": false,
        "approved": false,
        "declined": false,
        "removed": false,
        "starred": false,
        "important": false,
        "labels": []
      };
      vm.transaction.push(vm.moreData);
      vm.transaction.milestones = vm.milestones;
      vm.transaction = $httpParamSerializer(vm.transaction);
      vm.moreData = $httpParamSerializer(vm.moreData);

      api.transactions.save([vm.transaction, vm.moreData],
        function (response) {
          //On success
          console.log("Transaction started successfully. Check your email for a copy.");

          //Go to transaction manager
          $state.go('app.transactions_manager');
        },
        //On error
        function (response) {
          console.error("It seems there has been an error. Please try again.");
          vm.transaction = {};
          $state.go('app.transactions');
        }
      );
      //Clear data
      vm.transaction = {};
    }

    function sendForm(ev)
    {
      // You can do an API call here to send the form to your server

      // Show the sent data.. you can delete this safely.
      $mdDialog.show({
        controller         : function ($scope, $mdDialog, formWizardData)
        {
          $scope.formWizardData = formWizardData;
          $scope.closeDialog = function ()
          {
            $mdDialog.hide();
          };
        },
        template           : '<md-dialog>' +
        '  <md-dialog-content><h1>You have sent the form with the following data</h1><div><pre>{{formWizardData | json}}</pre></div></md-dialog-content>' +
        '  <md-dialog-actions>' +
        '    <md-button ng-click="closeDialog()" class="md-primary">' +
        '      Close' +
        '    </md-button>' +
        '  </md-dialog-actions>' +
        '</md-dialog>',
        parent             : angular.element('body'),
        targetEvent        : ev,
        locals             : {
          formWizardData: vm.transaction
        },
        clickOutsideToClose: true
      });

      // Clear the form data
      vm.transaction = {};
    }

    $scope.Range = function(start, end, $scope) {
      var year = new Date().getFullYear();
      var range = [];
      range.push(year);
      for(var i=1;i<117;i++) {
        range.push(year - i);
      }
      return range;
    };
  }
})();
