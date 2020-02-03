(function ()
{
  'use strict';

  angular
    .module('app.invoice', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
  {
    // State
    $stateProvider
      .state('app.pages_invoice_modern', {
        url      : '/invoice-sample',
        views    : {
          'content@app': {
            templateUrl: 'app/main/products/escrow/invoice/views/modern/modern.html',
            controller : 'InvoiceController as vm'
          }
        },
        resolve  : {
          Invoice: function (msApi)
          {
            return msApi.resolve('invoice@get');
          }
        },
        bodyClass: 'invoice printable'
      });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/products/escrow/invoice');

    // Api
    msApiProvider.register('invoice', ['app/data/invoice/invoice.json']);
  }

})();
