(function ()
{
  'use strict';

  angular
    .module('app.client-wallet')
    .controller('WalletController', WalletController);

  /** @ngInject */
  function WalletController($scope, $rootScope, $log, localStorageService, $resource, $document, $mdMedia, $mdToast, $mdSidenav, $state, msApi, $mdDialog, api, $httpParamSerializer, Idle, Keepalive)
  {
    var vm = this;

    // Data
    vm.withdraw = {};

    vm.currentUser = localStorageService.get('publicId');

    vm.getBalance = getBalance;
    function getBalance() {
      msApi.request('products.wallet.balance@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.balance = response;
        },
        function (response) {
          vm.balance = {
            actualBalance: 'Err'
          };

          return [];
        }
      );
    }

    vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg', 'green-bg'];

    function getFolders() {
      vm.folders = $resource('app/data/wallet/folders.json', {}, {'get': {method: 'GET'}});
      vm.folders.get(
        function (response) {
          vm.folders = response.data;
        },
        function (response) {
          return [];
        }
      );
    }

    function getCurrency() {
      vm.currency = $resource('app/data/wallet/account.json', {}, {'get': {method: 'GET'}});
      vm.currency.get(
        function (response) {
          vm.account = response;
        },
        function (response) {
          return [];
        }
      );
    }

    vm.getBankAccounts = getBankAccounts;
    function getBankAccounts() {
      msApi.request('products.wallet.banks@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.banks = response;
        },
        function (response) {
          return [];
        }
      );
    }

    vm.loadingThreads = true;

    vm.currentFilter = {
      filter: $state.params.filter
    };
    vm.currentThread = null;
    vm.selectedThreads = [];

    vm.views = {
      outlook: 'app/main/products/wallet/views/outlook/outlook-view.html'
    };
    vm.defaultView = 'outlook';
    vm.currentView = 'outlook';

    // Methods
    vm.loadFolder = loadFolder;
    vm.isFolderActive = isFolderActive;

    vm.openThread = openThread;
    vm.closeThread = closeThread;

    vm.isSelected = isSelected;
    vm.toggleSelectThread = toggleSelectThread;
    vm.selectThreads = selectThreads;
    vm.deselectThreads = deselectThreads;
    vm.toggleSelectThreads = toggleSelectThreads;

    vm.setThreadStatus = setThreadStatus;
    vm.toggleThreadStatus = toggleThreadStatus;

    vm.changeView = changeView;

    vm.toggleSidenav = toggleSidenav;

    vm.checkWithdrawalValidity = checkWithdrawalValidity;
    vm.requestWithdrawal = requestWithdrawal;
    vm.getAllWithdrawals = getAllWithdrawals;

    //////////

    init();

    /**
     * Initialize
     */
    function init()
    {
      // Initialize data functions
      vm.getBalance();
      getFolders();
      getCurrency();
      getBankAccounts();
      getAllWithdrawals();
    }

    /**
     * Get All Withdrawals
     */
    function getAllWithdrawals() {
      // Request the withdrawals
      msApi.request('products.wallet.withdrawals@get', {userPublicId: vm.currentUser}).then(
        // Success
        function (response) {
          // Load new threads
          vm.threads = response;
          vm.threadsTotals = response;

          // Hide the loading screen
          vm.loadingThreads = false;

          // Open the thread if needed
          if ( $state.params.threadId )
          {
            for ( var i = 0; i < vm.threads.length; i++ )
            {
              if ( vm.threads[i].id === $state.params.threadId )
              {
                vm.openThread(vm.threads[i]);
                break;
              }
            }
          }
        }
      );
    }

    /**
     * Withdrawal validity check
     */
    function checkWithdrawalValidity() {
      // Check whether there is enough funds to withdraw
      var currentBalance = vm.balance.actualBalance;
      if (vm.withdraw.amount > currentBalance) {
        requestStatus('You do not have enough funds to withdraw. Please top up your account and try again.');
      } else
      if (vm.withdraw.amount <= currentBalance){
        requestWithdrawal();
      }
    }

    /**
     * Request withdrawal
     */
    function requestWithdrawal() {
      // Payload
      if(vm.withdraw.bank && !vm.withdraw.mobileNumber){
        var mode = 'BANKACCOUNT';
      } else if(vm.withdraw.mobileNumber && !vm.withdraw.bank) {
        var mode = 'MOBILE';
      }

      if(vm.withdraw.bank && !vm.withdraw.mobileNumber){
        for(var i=0; i<vm.banks.content.length; i++){
          if (vm.banks.content[i].publicId === vm.withdraw.bank) {
            vm.bankVersion = vm.banks.content[i].version;
          }
        }
      }

      vm.withdrawPayload = {
        withdrawMode: mode,
        amount: vm.withdraw.amount,
        bankAccount: {
          publicId: vm.withdraw.bank,
          version: vm.bankVersion
        },
        phoneNumber: vm.withdraw.mobileNumber
      };

      api.wallet.withdraw.request({userPublicId: vm.currentUser}, vm.withdrawPayload,
        function (response) {
          requestStatus('Request sent successfully');
        },
        function (response) {
          requestStatus('Error in request. Try again');
        }
      );
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

    // Watch screen size to change view modes
    $scope.$watch(function ()
    {
      return $mdMedia('xs');
    }, function (current, old)
    {
      if ( angular.equals(current, old) )
      {
        return;
      }

      if ( current )
      {
        vm.currentView = 'outlook';
      }
    });

    $scope.$watch(function ()
    {
      return $mdMedia('gt-xs');
    }, function (current, old)
    {
      if ( angular.equals(current, old) )
      {
        return;
      }

      if ( current )
      {
        if ( vm.defaultView === 'outlook' )
        {
          vm.currentView = 'outlook';
        }
      }
    });

    /**
     * Load folder
     *
     * @param name
     */
    function loadFolder(name) {
      // If we are already in the selected folder and
      // there is an open thread just close it
      if ( vm.isFolderActive(name) )
      {
        // Close the current thread if open
        if ( vm.currentThread )
        {
          vm.closeThread();
        }

        return;
      }

      // Show loader
      $rootScope.loadingProgress = true;

      // Update the state without reloading the controller
      $state.go('app.wallet.threads', {
        type  : null,
        filter: name
      }, {notify: false});

      // Build the API name
      var apiName = 'wallet.folder.' + name + '@get';

      // Make the call
      msApi.request(apiName).then(
        // Success
        function (response)
        {
          // Load new threads
          vm.threads = response.data;
          vm.threadsTotals = response;

          // Set the current filter
          vm.currentFilter = {
            type  : null,
            filter: name
          };

          // Close the current thread if open
          if ( vm.currentThread )
          {
            vm.closeThread();
          }

          // Hide loader
          $rootScope.loadingProgress = false;
        }
      );
    }

    /**
     * Is the folder with the given name active?
     *
     * @param name
     * @returns {boolean}
     */
    function isFolderActive(name) {
      return (vm.currentFilter.filter === name);
    }

    /**
     * Open thread
     *
     * @param thread
     */
    function openThread(thread) {
      // Set the read status on the thread
      thread.read = true;

      // Assign thread as the current thread
      vm.currentThread = thread;

      // Update the state without reloading the controller
      $state.go('app.wallet.threads.thread', {threadId: thread.id}, {notify: false});
    }

    /**
     * Close thread
     */
    function closeThread() {
      vm.currentThread = null;

      // Update the state without reloading the controller
      $state.go('app.wallet.threads', {
        filter: vm.currentFilter.filter
      }, {notify: false});
    }

    /**
     * Return selected status of the thread
     *
     * @param thread
     * @returns {boolean}
     */
    function isSelected(thread) {
      return vm.selectedThreads.indexOf(thread) > -1;
    }

    /**
     * Toggle selected status of the thread
     *
     * @param thread
     * @param event
     */
    function toggleSelectThread(thread, event) {
      if ( event )
      {
        event.stopPropagation();
      }

      if ( vm.selectedThreads.indexOf(thread) > -1 )
      {
        vm.selectedThreads.splice(vm.selectedThreads.indexOf(thread), 1);
      }
      else
      {
        vm.selectedThreads.push(thread);
      }
    }

    /**
     * Select threads. If key/value pair given,
     * threads will be tested against them.
     *
     * @param [key]
     * @param [value]
     */
    function selectThreads(key, value) {
      // Make sure the current selection is cleared
      // before trying to select new threads
      vm.selectedThreads = [];

      for ( var i = 0; i < vm.threads.length; i++ )
      {
        if ( angular.isUndefined(key) && angular.isUndefined(value) )
        {
          vm.selectedThreads.push(vm.threads[i]);
          continue;
        }

        if ( angular.isDefined(key) && angular.isDefined(value) && vm.threads[i][key] === value )
        {
          vm.selectedThreads.push(vm.threads[i]);
        }
      }
    }

    /**
     * Deselect threads
     */
    function deselectThreads() {
      vm.selectedThreads = [];
    }

    /**
     * Toggle select threads
     */
    function toggleSelectThreads() {
      if ( vm.selectedThreads.length > 0 )
      {
        vm.deselectThreads();
      }
      else
      {
        vm.selectThreads();
      }
    }

    /**
     * Set the status on given thread, current thread or selected threads
     *
     * @param key
     * @param value
     * @param [thread]
     * @param [event]
     */
    function setThreadStatus(key, value, thread, event) {
      // Stop the propagation if event provided
      // This will stop unwanted actions on button clicks
      if ( event )
      {
        event.stopPropagation();
      }

      // If the thread provided, do the changes on that
      // particular thread
      if ( thread )
      {
        thread[key] = value;
        return;
      }

      // If the current thread is available, do the
      // changes on that one
      if ( vm.currentThread )
      {
        vm.currentThread[key] = value;
        return;
      }

      // Otherwise do the status update on selected threads
      for ( var x = 0; x < vm.selectedThreads.length; x++ )
      {
        vm.selectedThreads[x][key] = value;
      }
    }

    /**
     * Toggle the value of the given key on given thread, current
     * thread or selected threads. Given key value must be boolean.
     *
     * @param key
     * @param thread
     * @param event
     */
    function toggleThreadStatus(key, thread, event) {
      // Stop the propagation if event provided
      // This will stop unwanted actions on button clicks
      if ( event )
      {
        event.stopPropagation();
      }

      // If the thread provided, do the changes on that
      // particular thread
      if ( thread )
      {
        if ( typeof(thread[key]) !== 'boolean' )
        {
          return;
        }

        thread[key] = !thread[key];
        return;
      }

      // If the current thread is available, do the
      // changes on that one
      if ( vm.currentThread )
      {
        if ( typeof(vm.currentThread[key]) !== 'boolean' )
        {
          return;
        }

        vm.currentThread[key] = !vm.currentThread[key];
        return;
      }

      // Otherwise do the status update on selected threads
      for ( var x = 0; x < vm.selectedThreads.length; x++ )
      {
        if ( typeof(vm.selectedThreads[x][key]) !== 'boolean' )
        {
          continue;
        }

        vm.selectedThreads[x][key] = !vm.selectedThreads[x][key];
      }
    }

    /**
     * Change the view
     *
     * @param view
     */
    function changeView(view) {
      if ( vm.views[view] )
      {
        vm.defaultView = view;
        vm.currentView = view;
      }
    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId) {
      $mdSidenav(sidenavId).toggle();
    }

    function requestStatus(data) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(data)
          .position('top right')
          .hideDelay(5000)
      );
    }
  }
})();
