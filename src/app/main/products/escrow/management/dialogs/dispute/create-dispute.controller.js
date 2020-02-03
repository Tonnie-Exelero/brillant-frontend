/**
 * Created by TONNIE on 12/31/2016.
 */
(function ()
{
  'use strict';

  angular
    .module('app.management')
    .controller('CreateDisputeController', CreateDisputeController);

  /** @ngInject */
  function CreateDisputeController($mdDialog, currentThread, api, $httpParamSerializer)
  {
    var vm = this;

    // Data
    vm.form = {
      "transaction_id": currentThread.id,
      "with": currentThread.main.email,
      "transaction": currentThread.main.name,
      "labels": [ 1 ]
    };

    // Methods
    vm.closeDialog = closeDialog;
    vm.sendDispute = sendDispute;
    vm.sendForm = sendForm;

    //////////

    function closeDialog()
    {
      $mdDialog.hide();
    }

    function sendDispute()
    {
      vm.form = $httpParamSerializer(vm.form);

      api.management.disputes.save(vm.form,
        function (response)
        {
          console.log("Successfully submitted dispute.");
          vm.closeDialog();
        },
        function (response)
        {
          console.error("There was an error submitting the dispute. Please try again!");
          vm.form = {};
          vm.closeDialog();
        }
      );

      vm.form = {};
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
          formWizardData: vm.form
        },
        clickOutsideToClose: true
      });

      // Clear the form data
      vm.horizontalStepper = {};
    }
  }
})();
