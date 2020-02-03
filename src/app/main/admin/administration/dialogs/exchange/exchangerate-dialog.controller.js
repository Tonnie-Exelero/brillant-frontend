(function ()
{
    'use strict';

    angular
        .module('app.administration')
        .controller('ExchangeRateDialogController', ExchangeRateDialogController);

    /** @ngInject */
    function ExchangeRateDialogController($mdDialog, Rate, Rates, event)
    {
        var vm = this;

        // Data
        vm.title = 'Edit Rate';
        vm.rate = angular.copy(Rate);
        vm.rates = Rates;
        vm.newRate = false;

        if ( !vm.rate )
        {
            vm.rate = {
                'id'                : '',
                'title'             : '',
                'notes'             : '',
                'startDate'         : new Date(),
                'startDateTimeStamp': new Date().getTime(),
                'dueDate'           : '',
                'dueDateTimeStamp'  : '',
                'completed'         : false,
                'starred'           : false,
                'important'         : false,
                'deleted'           : false,
                'tags'              : []
            };
            vm.title = 'New Rate';
            vm.newRate = true;
            vm.rate.tags = [];
        }

        // Methods
        vm.addNewRate = addNewRate;
        vm.saveRate = saveRate;
        vm.deleteRate = deleteRate;
        vm.newTag = newTag;
        vm.closeDialog = closeDialog;

        //////////

        /**
         * Add new rate
         */
        function addNewRate()
        {
            vm.rates.unshift(vm.rate);

            closeDialog();
        }

        /**
         * Save rate
         */
        function saveRate()
        {
            // Dummy save action
            for ( var i = 0; i < vm.rates.length; i++ )
            {
                if ( vm.rates[i].id === vm.rate.id )
                {
                    vm.rates[i] = angular.copy(vm.rate);
                    break;
                }
            }

            closeDialog();
        }

        /**
         * Delete rate
         */
        function deleteRate()
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .content('The Rate will be deleted.')
                .ariaLabel('Delete Rate')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);

            $mdDialog.show(confirm).then(function ()
            {
                // Dummy delete action
                for ( var i = 0; i < vm.rates.length; i++ )
                {
                    if ( vm.rates[i].id === vm.rate.id )
                    {
                        vm.rates[i].deleted = true;
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
