(function ()
{
    'use strict';

    angular
        .module('app.administration')
        .controller('CountryDialogController', CountryDialogController);

    /** @ngInject */
    function CountryDialogController($mdDialog, Country, Countries, event)
    {
        var vm = this;

        // Data
        vm.title = 'Edit Country';
        vm.country = angular.copy(Country);
        vm.countries = Countries;
        vm.newCountry = false;

        if ( !vm.country )
        {
            vm.country = {
                'id'                : '',
                'title'             : '',
                'abbreviation'      : '',
                'country_code'      : '',
                'time_zone'         : '',
                'currency'          : '',
                'currency_code'     : '',
                'notes'             : ''
            };
            vm.title = 'New Country';
            vm.newCountry = true;
            vm.country.tags = [];
        }

        // Methods
        vm.addNewCountry = addNewCountry;
        vm.saveCountry = saveCountry;
        vm.deleteCountry = deleteCountry;
        vm.newTag = newTag;
        vm.closeDialog = closeDialog;

        //////////

        /**
         * Add new country
         */
        function addNewCountry()
        {
            vm.countries.unshift(vm.country);

            closeDialog();
        }

        /**
         * Save country
         */
        function saveCountry()
        {
            // Dummy save action
            for ( var i = 0; i < vm.countries.length; i++ )
            {
                if ( vm.countries[i].id === vm.country.id )
                {
                    vm.countries[i] = angular.copy(vm.country);
                    break;
                }
            }

            closeDialog();
        }

        /**
         * Delete country
         */
        function deleteCountry()
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .content('The Country will be deleted.')
                .ariaLabel('Delete Country')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);

            $mdDialog.show(confirm).then(function ()
            {
                // Dummy delete action
                for ( var i = 0; i < vm.countries.length; i++ )
                {
                    if ( vm.countries[i].id === vm.country.id )
                    {
                        vm.countries[i].deleted = true;
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
