(function ()
{
  'use strict';

  angular
    .module('app.management')
    .controller('CreateInvoiceController', CreateInvoiceController);

  /** @ngInject */
  function CreateInvoiceController($mdDialog, api, $httpParamSerializer, $cookies, $state)
  {
    var vm = this;

    // Data
    vm.invoice = {
      "number": "P9-0004",
      "date": "Jul 19, 2016",
      "paid": false,
      "from": {
        "id": "$cookies.get('id', response.id)",
        "title": "Brillant Inc.",
        "address": "2810 Country Club Road Cranford, NJ 07016",
        "phone": "+66 123 455 87",
        "email": "hello@brillant.com",
        "website": "www.brillant.com"
      }
    };

    // Methods
    vm.closeDialog = closeDialog;
    vm.submitInvoice = submitInvoice;
    vm.previewInvoice = previewInvoice;

    //////////

    function closeDialog()
    {
      $mdDialog.hide();
    }

    /**
     * Submit Invoice
     */
    function submitInvoice() {
      if(vm.invoice.service1){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;

        vm.totals = vm.total1;
      }else if(vm.invoice.service1 && vm.invoice.service2){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;
        vm.total2 = vm.invoice.service2.unitPrice * vm.invoice.service2.quantity;

        vm.totals = vm.total1 + vm.total2;
      }else if(vm.invoice.service1 && vm.invoice.service2 && vm.invoice.service3){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;
        vm.total2 = vm.invoice.service2.unitPrice * vm.invoice.service2.quantity;
        vm.total3 = vm.invoice.service3.unitPrice * vm.invoice.service3.quantity;

        vm.totals = vm.total1 + vm.total2 + vm.total3;
      }else if(vm.invoice.service1 && vm.invoice.service2 && vm.invoice.service3 && vm.invoice.service4){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;
        vm.total2 = vm.invoice.service2.unitPrice * vm.invoice.service2.quantity;
        vm.total3 = vm.invoice.service3.unitPrice * vm.invoice.service3.quantity;
        vm.total4 = vm.invoice.service4.unitPrice * vm.invoice.service4.quantity;

        vm.totals = vm.total1 + vm.total2 + vm.total3 + vm.total4;
      }else if(vm.invoice.service1 && vm.invoice.service2 && vm.invoice.service3 && vm.invoice.service4 && vm.invoice.service5){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;
        vm.total2 = vm.invoice.service2.unitPrice * vm.invoice.service2.quantity;
        vm.total3 = vm.invoice.service3.unitPrice * vm.invoice.service3.quantity;
        vm.total4 = vm.invoice.service4.unitPrice * vm.invoice.service4.quantity;
        vm.total5 = vm.invoice.service5.unitPrice * vm.invoice.service5.quantity;

        vm.totals = vm.total1 + vm.total2 + vm.total3 + vm.total4 + vm.total5;
      }

      vm.moreInvoice = {
        "subtotal": vm.totals,
        "tax": vm.totals * 0.16,
        "discount": vm.totals * 0.08,
        "total": vm.totals + [vm.totals * 0.16] - [vm.totals * 0.08]
      };

      //API call
      api.management.invoices.save([vm.invoice, vm.moreInvoice],
        function (response) {
          console.log("Invoice sent successfully.");

          vm.closeDialog();

          //Go to invoices
          $state.go('app.management.threads', {
            type: 'label',
            filter: 'invoices'
          });

          //Put it to cookie
          $cookies.put("state", "invoices")
        },
        function (response) {
          console.error("There was an error sending the invoice. Please try again!");

          vm.invoice = {};
        }
      );
    }


    /**
     * Preview Invoice
     *
     */
    function previewInvoice(ev) {
      if(vm.invoice.service1){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;

        vm.totals = vm.total1;
      }else if(vm.invoice.service1 && vm.invoice.service2){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;
        vm.total2 = vm.invoice.service2.unitPrice * vm.invoice.service2.quantity;

        vm.totals = vm.total1 + vm.total2;
      }else if(vm.invoice.service1 && vm.invoice.service2 && vm.invoice.service3){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;
        vm.total2 = vm.invoice.service2.unitPrice * vm.invoice.service2.quantity;
        vm.total3 = vm.invoice.service3.unitPrice * vm.invoice.service3.quantity;

        vm.totals = vm.total1 + vm.total2 + vm.total3;
      }else if(vm.invoice.service1 && vm.invoice.service2 && vm.invoice.service3 && vm.invoice.service4){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;
        vm.total2 = vm.invoice.service2.unitPrice * vm.invoice.service2.quantity;
        vm.total3 = vm.invoice.service3.unitPrice * vm.invoice.service3.quantity;
        vm.total4 = vm.invoice.service4.unitPrice * vm.invoice.service4.quantity;

        vm.totals = vm.total1 + vm.total2 + vm.total3 + vm.total4;
      }else if(vm.invoice.service1 && vm.invoice.service2 && vm.invoice.service3 && vm.invoice.service4 && vm.invoice.service5){
        vm.total1 = vm.invoice.service1.unitPrice * vm.invoice.service1.quantity;
        vm.total2 = vm.invoice.service2.unitPrice * vm.invoice.service2.quantity;
        vm.total3 = vm.invoice.service3.unitPrice * vm.invoice.service3.quantity;
        vm.total4 = vm.invoice.service4.unitPrice * vm.invoice.service4.quantity;
        vm.total5 = vm.invoice.service5.unitPrice * vm.invoice.service5.quantity;

        vm.totals = vm.total1 + vm.total2 + vm.total3 + vm.total4 + vm.total5;
      }

      vm.moreInvoice = {
        "subtotal": vm.totals,
        "tax": vm.totals * 0.16,
        "discount": vm.totals * 0.08,
        "total": vm.totals + [vm.totals * 0.16] - [vm.totals * 0.08]
      };

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
          formWizardData: [vm.invoice, vm.moreInvoice]
        },
        clickOutsideToClose: true
      });
    }
  }
})();
