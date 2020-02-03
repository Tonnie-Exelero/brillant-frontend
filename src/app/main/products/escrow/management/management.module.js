(function ()
{
    'use strict';

    angular
        .module('app.management',
            [
                // 3rd Party Dependencies
                'textAngular'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider)
    {
        // State
        $stateProvider
            .state('app.management', {
                abstract: true,
                url     : '/management',
                resolve : {
                    Folders: function (msApi)
                    {
                        return msApi.resolve('management.folders@get');
                    },
                    Labels : function (msApi)
                    {
                        return msApi.resolve('management.labels@get');
                    }
                }
            })
            .state('app.management.threads', {
                url      : '/{type:(?:label)}/:filter',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/products/escrow/management/management.html',
                        controller : 'ManagerController as vm'
                    }
                },
                params   : {
                    type: {
                        value : null,
                        squash: true
                    }
                },
                bodyClass: 'management'
            })
            .state('app.management.threads.thread', {
                url      : '/:threadId',
                bodyClass: 'management'
            })
            .state('app.invoice_preview', {
              url   :   '/preview-invoice',
              views : {
                'content@app': {
                  templateUrl : 'app/main/products/escrow/management/dialogs/invoice/invoice-preview.html',
                  controller  : 'CreateInvoiceController as vm'
                }
              }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/products/escrow/management');

        // Api
        msApiProvider.register('management.folders', ['app/data/transactions/management/folders.json']);
        msApiProvider.register('management.labels', ['app/data/transactions/management/labels.json']);

        msApiProvider.register('management.label.disputes', ['app/data/transactions/management/labels/disputes.json']);
        msApiProvider.register('management.label.invoices', ['app/data/transactions/management/labels/invoices.json']);

        msApiProvider.register('management.folder.selling', ['app/data/transactions/management/folders/selling.json']);
        msApiProvider.register('management.folder.buying', ['app/data/transactions/management/folders/buying.json']);
        msApiProvider.register('management.folder.brokering', ['app/data/transactions/management/folders/brokering.json']);
        msApiProvider.register('management.folder.trash', ['app/data/transactions/management/folders/trash.json']);
    }
})();
