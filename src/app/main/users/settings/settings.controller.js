(function ()
{
  'use strict';

  angular
    .module('app.users.settings')
    .controller('SettingsController', SettingsController);

  /** @ngInject */
  function SettingsController($scope, $resource, api, msApi, $mdToast, localStorageService, $mdSidenav, msUtils, $mdDialog, $document, $log, Idle, Keepalive, $state)
  {

    var vm = this;

    vm.apiKeys = {
      test:{
        publishable:'',
        secret:''
      },
      live:{
        publishable:'',
        secret:''
      }
    };

    vm.tooltip1 = {
      text: 'Copy key'
    };
    vm.tooltip2 = {
      text: 'Copy key'
    };
    vm.tooltip3 = {
      text: 'Copy key'
    };
    vm.tooltip4 = {
      text: 'Copy key'
    };

    // Data
    vm.currentUser = localStorageService.get('publicId');

    function getAccount() {
      msApi.request('users.settings.account@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.account = response;
        },
        function (response) {
          vm.account = {
            firstName: "Err",
            email: "Err"
          };
        }
      );
    }

    function getApi() {
      msApi.request('users.settings.api@get', {userPublicId: vm.currentUser}).then(
        function (response) {

          for(var i=0; i<response.length; i++){
            if (response[i].purpose === 'TEST' && response[i].type === 'PUBLISHABLE') {
              vm.apiKeys.test.publishable = response[i].value;
            } else if (response[i].purpose === 'TEST' && response[i].type === 'SECRET') {
              vm.apiKeys.test.secret = response[i].value;
            } else if (response[i].purpose === 'LIVE' && response[i].type === 'PUBLISHABLE') {
              vm.apiKeys.live.publishable = response[i].value;
            } else if (response[i].purpose === 'LIVE' && response[i].type === 'SECRET') {
              vm.apiKeys.live.secret = response[i].value;
            }
          }
        },
        function (response) {
          vm.apiKeys = {
            test:{
              publishable:'Err',
              secret:'Err'
            },
            live:{
              publishable:'Err',
              secret:'Err'
            }
          };
        }
      );
    }

   /* vm.getNotifications = getNotifications;
    function getNotifications() {
      msApi.request('settings.notifications@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.notifications = response.data;
        },
        function (response) {
          return [];
        }
      )
    }

    vm.getReports = getReports;
    function getReports() {
      msApi.request('settings.reports@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.reports = response.data;
        },
        function (response) {
          return [];
        }
      )
    }

    vm.getSecurity = getSecurity;
    function getSecurity() {
      msApi.request('settings.security@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.security = response.data;
        },
        function (response) {
          return [];
        }
      )
    }*/

    function getBanks() {
      msApi.request('users.settings.banks@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.banks = response;
        },
        function (response) {
          return [];
        }
      );
    }

    function getNotifications() {
      vm.notifications = $resource('app/data/settings/notifications.json', {}, {'get': {method: 'GET'}});
      vm.notifications.get(
        function (response) {
          vm.notifications = response.data;
        },
        function (response) {
          return [];
        }
      );
    }

    function getReports() {
      vm.reports = $resource('app/data/settings/reports.json', {}, {'get': {method: 'GET'}});
      vm.reports.get(
        function (response) {
          vm.reports = response.data;
        },
        function (response) {
          return [];
        }
      );
    }

    function getSecurity() {
      vm.security = $resource('app/data/settings/security.json', {}, {'get': {method: 'GET'}});
      vm.security.get(
        function (response) {
          vm.security = response.data;
        },
        function (response) {
          return [];
        }
      );
    }

   /* vm.getCards = getCards;
    function getCards() {
      msApi.request('settings.cards@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.cards = response;
        },
        function (response) {
          return [];
        }
      );
    }

    vm.getMobiles = getMobiles;
    function getMobiles() {
      msApi.request('settings.mobile@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.mobiles = response.data;
        },
        function (response) {
          return [];
        }
      )
    }*/

    vm.bank = {};
    vm.card = {};
    vm.mobile = {};
    vm.filterIds = null;
    vm.listType = 'acc_info';
    vm.listOrder = 'name';
    vm.listOrderAsc = false;
    vm.selectedSettings = [];
    vm.newGroupName = '';
    vm.ngFlowOptions = {
      // You can configure the ngFlow from here
      /*target                   : 'api/media/image',
       chunkSize                : 15 * 1024 * 1024,
       maxChunkRetries          : 1,
       simultaneousUploads      : 1,
       testChunks               : false,
       progressCallbacksInterval: 1000*/
    };
    vm.ngFlow = {
      // ng-flow will be injected into here through its directive
      flow: {}
    };

    // Methods
    vm.changeTooltipText1 = changeTooltipText1;
    vm.changeTooltipText2 = changeTooltipText2;
    vm.changeTooltipText3 = changeTooltipText3;
    vm.changeTooltipText4 = changeTooltipText4;
    vm.filterChange = filterChange;
    vm.openSettingDialog = openSettingDialog;
    vm.deleteSettingConfirm = deleteSettingConfirm;
    vm.deleteSetting = deleteSetting;
    vm.deleteSelectedSettings = deleteSelectedSettings;
    vm.toggleSelectSetting = toggleSelectSetting;
    vm.deselectSettings = deselectSettings;
    vm.selectAllSettings = selectAllSettings;
    vm.deleteSetting = deleteSetting;
    vm.addNewGroup = addNewGroup;
    vm.deleteGroup = deleteGroup;
    vm.toggleSidenav = toggleSidenav;
    vm.toggleInArray = msUtils.toggleInArray;
    vm.exists = msUtils.exists;
    vm.fileAdded = fileAdded;
    vm.upload = upload;
    vm.fileSuccess = fileSuccess;
    vm.addBankAccount = addBankAccount;
    vm.addCard = addCard;
    vm.addMobile = addMobile;
    vm.changePassword = changePassword;

    //////////

    init();

    function init() {
      getApi();
      getAccount();
      getBanks();
      getNotifications();
      // getCards();
      getReports();
      // getMobiles();
      getSecurity();
    }

    /**
     * Do something when idle
     */
    $scope.started = true;

    $scope.$on('IdleStart', function() {
      $state.go('app.auth_lock');
    });

    $scope.$on('IdleEnd', function() {
      // Something here
    });

    $scope.$on('IdleTimeout', function() {
      $state.go('app.auth_lock');
    });

    $scope.start = function() {
      Idle.watch();
      $scope.started = true;
    };

    $scope.stop = function() {
      Idle.unwatch();
      $scope.started = false;
    };

    /**
     * Change Tooltip text 1
     */
    function changeTooltipText1() {
      vm.tooltip1 = {
        text: 'Copied'
      };
    }

    /**
     * Change Tooltip text 2
     */
    function changeTooltipText2() {
      vm.tooltip2 = {
        text: 'Copied'
      };
    }

    /**
     * Change Tooltip text 3
     */
    function changeTooltipText3() {
      vm.tooltip3 = {
        text: 'Copied'
      };
    }

    /**
     * Change Tooltip text 4
     */
    function changeTooltipText4() {
      vm.tooltip4 = {
        text: 'Copied'
      };
    }

    /**
     * Change Settings List Filter
     * @param type
     */
    function filterChange(type)
    {

      vm.listType = type;

      if ( type === '' )
      {
        vm.filterIds = null;
      }

      vm.selectedSettings = [];

    }

    /**
     * Open new contact dialog
     *
     * @param ev
     * @param contact
     */
    function openSettingDialog(ev, contact)
    {
      $mdDialog.show({
        controller         : 'ContactDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/users/settings/dialogs/contact/contact-dialog.html',
        parent             : angular.element($document.find('#content-container')),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          Setting : contact,
          User    : vm.user,
          Settings: vm.settings
        }
      });
    }

    /**
     * Delete Setting Confirm Dialog
     */
    function deleteSettingConfirm(contact, ev)
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the contact?')
        .htmlContent('<b>' + contact.name + ' ' + contact.lastName + '</b>' + ' will be deleted.')
        .ariaLabel('delete contact')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        deleteSetting(contact);
        vm.selectedSettings = [];

      }, function ()
      {

      });
    }

    /**
     * Delete Setting
     */
    function deleteSetting(contact)
    {
      vm.settings.splice(vm.settings.indexOf(contact), 1);
    }

    /**
     * Delete Selected Settings
     */
    function deleteSelectedSettings(ev)
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the selected settings?')
        .htmlContent('<b>' + vm.selectedSettings.length + ' selected</b>' + ' will be deleted.')
        .ariaLabel('delete settings')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        vm.selectedSettings.forEach(function (contact)
        {
          deleteSetting(contact);
        });

        vm.selectedSettings = [];

      });

    }

    /**
     * Toggle selected status of the setting
     *
     * @param contact
     * @param event
     */
    function toggleSelectSetting(contact, event)
    {
      if ( event )
      {
        event.stopPropagation();
      }

      if ( vm.selectedSettings.indexOf(contact) > -1 )
      {
        vm.selectedSettings.splice(vm.selectedSettings.indexOf(contact), 1);
      }
      else
      {
        vm.selectedSettings.push(contact);
      }
    }

    /**
     * Deselect settings
     */
    function deselectSettings()
    {
      vm.selectedSettings = [];
    }

    /**
     * Sselect all settings
     */
    function selectAllSettings()
    {
      vm.selectedSettings = $scope.filteredSettings;
    }

    /**
     *
     */
    function addNewGroup()
    {
      if ( vm.newGroupName === '' )
      {
        return;
      }

      var newGroup = {
        'id'        : msUtils.guidGenerator(),
        'name'      : vm.newGroupName,
        'contactIds': []
      };

      vm.user.groups.push(newGroup);
      vm.newGroupName = '';
    }

    /**
     * Delete Group
     */
    function deleteGroup(ev)
    {
      var group = vm.listType;

      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the group?')
        .htmlContent('<b>' + group.name + '</b>' + ' will be deleted.')
        .ariaLabel('delete group')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        vm.user.groups.splice(vm.user.groups.indexOf(group), 1);

        filterChange('all');
      });

    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId)
    {
      $mdSidenav(sidenavId).toggle();
    }

    /**
     * File added callback
     * Triggers when files added to the uploader
     *
     * @param file
     */
    function fileAdded(file)
    {
      // Prepare the temp file data for file list
      var uploadingFile = {
        id       : file.uniqueIdentifier,
        file     : file,
        type     : '',
        owner    : 'public',
        size     : '',
        modified : moment().format('MMMM D, YYYY'),
        opened   : '',
        created  : moment().format('MMMM D, YYYY'),
        extention: '',
        location : 'assets/images/logos/' + file.uniqueIdentifier,
        offline  : false
      };

      if(vm.account.public.logoUrl)
      {
        vm.vm.account.public.logoUrl = uploadingFile.id;
      }

      // Append it to the file list
      vm.files.push(uploadingFile);

      // Call API to update
      api.users.update([vm.account.public.logoUrl, vm.files],
        function (response) {
          addSuccess("Successfully updated image.");
        },
        function (response) {
          addFail("There was an error. Please try again!");
        }
      );
    }

    /**
     * Upload
     * Automatically triggers when files added to the uploader
     */
    function upload()
    {
      // Set headers
      vm.ngFlow.flow.opts.headers = {
        'X-Requested-With': 'XMLHttpRequest',
        //'X-XSRF-TOKEN'    : localStorageService.get('XSRF-TOKEN')
      };

      vm.ngFlow.flow.upload();
    }

    /**
     * File upload success callback
     * Triggers when single upload completed
     *
     * @param file
     * @param message
     */
    function fileSuccess(file, message)
    {
      // Iterate through the media list, find the one we
      // are added as a temp and replace its data
      // Normally you would parse the message and extract
      // the uploaded file data from it
      angular.forEach(vm.product.images, function (media, index)
      {
        if ( media.id === file.uniqueIdentifier )
        {
          // Normally you would update the media item
          // from database but we are cheating here!
          var fileReader = new FileReader();
          fileReader.readAsDataURL(media.file.file);
          fileReader.onload = function (event)
          {
            media.url = event.target.result;
          };

          // Update the image type so the overlay can go away
          media.type = 'image';
        }
      });
    }

    /**
     * Add Bank Account
     */
    function addBankAccount() {
      api.users.bank.add({userPublicId: vm.currentUser}, vm.bank,
        function (response) {
          addSuccess("Bank account successfully created");
        }, function (response) {
          addFail("Error in creating account. Please try again");
        }
      );

      vm.banks.content.unshift(vm.bank);
    }

    /**
     * Add Card Account
     */
    function addCard() {
      api.users.card.add({userPublicId: vm.currentUser}, vm.card,
        function (response) {
          addSuccess("Card added successfully");
        }, function (response) {
          addFail("Error in adding card. Please try again");
        }
      );

      vm.cards.unshift(vm.card);
    }

    /**
     * Add Mobile Account
     */
    function addMobile() {
      api.users.mobile.add({userPublicId: vm.currentUser}, vm.mobile,
        function (response) {
          addSuccess("Mobile number added successfully");
        }, function (response) {
          addFail("Error in adding mobile. Please try again");
        }
      );

      vm.mobiles.unshift(vm.mobile);
    }

    /**
     * Remove Bank account
     */
    vm.removeBank = removeBank;
    function removeBank(ev, bank) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to remove the account?')
        .htmlContent('<b>' + bank.bankName + '</b>' + ' account will be removed.')
        .ariaLabel('delete bank account')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        removeBankAccount(bank);

      }, function ()
      {

      });
    }

    vm.removeBankAccount = removeBankAccount;
    function removeBankAccount(bank) {
      msApi.request('users.settings.banks.remove@remove', {publicId: bank.publicId}).then(
        function (response) {
          addSuccess('Bank Account successfully removed');
        },
        function (response) {
          addFail('Error in removing account. Try again');
        }
      );
      vm.banks.content.splice(vm.banks.content.indexOf(bank), 1);
    }


    /**
     * Remove Card
     */
    vm.removeCard = removeCard;
    vm.removeCardAccount = removeCardAccount;

    function removeCardAccount(card)
    {
      vm.cards.splice(vm.cards.indexOf(card), 1);
    }

    function removeCard(ev, card) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to remove the card?')
        .htmlContent('<b>' + card.network + '</b>' + ' card will be removed.')
        .ariaLabel('delete card')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        removeCardAccount(card);

      }, function ()
      {

      });
    }

    /**
     * Remove Mobile
     */
    vm.removeMobile = removeMobile;
    vm.removeMobileAccount = removeMobileAccount;

    function removeMobileAccount(mobile)
    {
      vm.mobiles.splice(vm.mobiles.indexOf(mobile), 1);
    }

    function removeMobile(ev, mobile) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to remove the mobile number?')
        .htmlContent('<b>' + mobile.number + '</b>' + ' will be removed.')
        .ariaLabel('delete mobile')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        removeMobileAccount(mobile);

      }, function ()
      {

      });
    }

    /**
     * Change Password
     */
    function changePassword() {
      // Make API call here
      addSuccess('Changed successfully');
    }

    function addSuccess(data) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(data)
          .position('top right')
          .hideDelay(5000)
      );
    }

    function addFail(error) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(error)
          .position('top right')
          .hideDelay(5000)
      );
    }
  }
})();
