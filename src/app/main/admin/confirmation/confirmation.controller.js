(function ()
{
  'use strict';

  angular
    .module('app.admin-confirmation')
    .controller('AdminConfirmationController', AdminConfirmationController);

  /** @ngInject */
  function AdminConfirmationController($log, api, $scope, $resource, $mdDialog, msApi, $state, Idle, $mdToast, Keepalive)
  {
    var vm = this;

    // Data
    vm.searchQuery = null;

    vm.searchActive = true;

    vm.confirmation = {};

    function getPendingTransactions() {
      var queryParams = {
        size: 1000
      };

      msApi.request('admin.confirmation.payments.pending@get', queryParams).then(
        function (response) {
          vm.payments = response;
        },
        function (response) {
          vm.payments = {
            totalElements: 'Err'
          };

          return [];
        }
      );
    }

    function getStatuses() {
      vm.currency = $resource('app/data/payments/statuses.json', {}, {'get': {method: 'GET'}});
      vm.currency.get(
        function (response) {
          vm.statuses = response.data;
        },
        function (response) {

        }
      );
    }

    vm.dtInstance = {};
    vm.dtOptions = {
      withFnServerData: getPendingTransactions(),
      dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs  : [
        {
          // Target the id column
          targets: 0,
          visible: false
        },
        {
          // Target the status column
          targets: 7,
          render : function (data, type)
          {
            if ( type === 'display' )
            {
              var paymentStatus = vm.getPaymentStatus(data);
              return '<span class="status ' + paymentStatus.color + '">' + paymentStatus.name + '</span>';
            }

            if ( type === 'filter' )
            {
              return vm.getPaymentStatus(data).name;
            }

            return data;
          }
        }
      ],
      initComplete: function ()
      {
        var api = this.api(),
          searchBox = angular.element('body').find('#e-commerce-products-search');

        // Bind an external input as a table wide search box
        if ( searchBox.length > 0 )
        {
          searchBox.on('keyup', function (event)
          {
            api.search(event.target.value).draw();
          });
        }
      },
      pagingType  : 'full_numbers',
      lengthMenu  : [10, 20, 30, 50, 100],
      pageLength  : 20,
      scrollY     : 'auto',
      responsive  : true,
      processing  : true,
      redraw      : true,
      // serverSide  : true,
      order       : [[0, 'asc']],
      paging      : true,
      rowCallback : rowCallback
    };

    vm.reloadData = reloadData;
    function reloadData() {
      toastNotification('Reloading...');
      vm.dtInstance.DataTable.state.save();

      //save the state of the datatable
      vm.dtInstance.rerender();
    }

    vm.refreshData = refreshData;
    function refreshData() {
      toastNotification('Refreshing transactions...');
      getPendingTransactions();
    }

    // Methods
    vm.getPaymentStatus = getPaymentStatus;
    vm.getTransaction = getTransaction;
    vm.displayTransaction = displayTransaction;
    vm.paymentApprove = paymentApprove;
    vm.paymentDispute = paymentDispute;

    ////////////////////////////////

    init();

    function init() {
      getStatuses();
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
     * Row call back with binding to bind angular ng-click
     *
     * @param nRow row html
     * @param aData row data
     * @param iDisplayIndex
     * @param iDisplayIndexFull
     * @returns {*}
     */
    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      // Unbind first in order to avoid any duplicate handler (see http://github.com/l-lin/angular-datatables/issues/87)
      $('td', nRow).unbind('click');
      $('td', nRow).bind('click', function () {
        $scope.$apply(function () {
          vm.payments(aData);
        });
      });
      return nRow;
    }

    /**
     * Get transaction status
     *
     * @param label
     * @returns {*}
     */
    function getPaymentStatus(label){
      for ( var i = 0; i < vm.statuses.length; i++ )
      {
        if ( vm.statuses[i].label === String(label))
        {
          return vm.statuses[i];
        }
      }
    }

    /**
     * Get transaction
     */
    function getTransaction() {
      api.payments.retrieve(vm.confirmation,
        function (response) {
          // Success
          if (response) {
            displayTransaction(response);
          }
          else {
            vm.confirmation = {};
          }
        }
      );
    }

    /**
     * Get transaction
     */
    function displayTransaction(data) {
      vm.transaction = {
        "confirmation": data.confirmation,
        "account": data.account,
        "currency": data.currency,
        "amount": data.amount,
        "description": data.description,
        "option": data.option,
        "service": data.service,
        "email": data.email,
        "phone": data.phone
      };
      return;
    }

    /**
     * Approve payment
     *
     * @param ev
     * @param transaction
     */
    function paymentApprove(ev, transaction){
      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .htmlContent('This transaction will be' + '<b>' + ' approved' + '</b>')
        .ariaLabel('APPROVE TRANSACTION')
        .targetEvent(ev)
        .ok('APPROVE')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {
        // API call to approve
        api.payments.approve.save({transactionPublicId: transaction.publicId}, transaction,
          function (response) {
            toastNotification('Payment approved');
            refreshData();
          },
          function (response) {
            toastNotification('Error in approving. Try again');
          }
        );
      }, function ()
      {

      });
    }

    /**
     * Dispute payment
     *
     * @param ev
     * @param transaction
     */
    function paymentDispute(ev, transaction){
      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .htmlContent('This transaction will be' + '<b>' + ' disputed' + '</b>')
        .ariaLabel('DISPUTE TRANSACTION')
        .targetEvent(ev)
        .ok('DISPUTE')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {
        // API call to reject

        refreshData();
      }, function ()
      {

      });
    }

    vm.toastNotification = toastNotification;
    function toastNotification(data) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(data)
          .position('top right')
          .hideDelay(3000)
      );
    }
  }
})();
