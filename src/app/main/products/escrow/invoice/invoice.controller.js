(function ()
{
    'use strict';

    angular
        .module('app.invoice')
        .controller('InvoiceController', InvoiceController);

    /** @ngInject */
    function InvoiceController(Invoice, $state, $cookies)
    {
        var vm = this;

        // Data
        vm.invoice = Invoice.data;

        // Methods
        vm.goToInvoice = goToInvoice;

        //////////

        // Go to Invoice
        function goToInvoice(){
          $state.go('app.management.threads', {
            type: "label",
            filter: "invoices"
          });

          //Put to cookie
          $cookies.put("state", "invoices")
        }
    }
})();
