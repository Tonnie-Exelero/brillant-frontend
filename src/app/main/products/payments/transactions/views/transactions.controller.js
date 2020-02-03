(function ()
{
  'use strict';

  angular
    .module('app.payments-transactions')
    .controller('TransactionsController', TransactionsController);

  /** @ngInject */
  function TransactionsController($scope, $filter, DTColumnBuilder, DTOptionsBuilder, $mdDialog, $rootScope, $document, $cookies, api, $mdToast, msApi, $log, localStorageService, Idle, Keepalive, $state, $resource)
  {
    var vm = this;

    vm.searchQuery = null;

    vm.searchActive = true;

    vm.dateFilterActive = true;

    // Data
    vm.keys = {
      test: {
        publishable: '',
        secret: ''
      },
      live: {
        publishable: '',
        secret: ''
      }
    };

    vm.refunds = {};

    vm.options = {
      toDate: new Date(),
      fromDate: moment().subtract(30, 'days').valueOf()
    };

    vm.currentUser = localStorageService.get('publicId');

    vm.getTransactions = getTransactions;
    function getTransactions() {
      var queryParams = {
        userPublicId: vm.currentUser,
        size: 1000
      };

      msApi.request('products.payments.transactions@get', queryParams).then(
        function (response) {
          vm.transactions = response;
        },
        function (response) {
          vm.transactions = {
            totalElements: 'Err'
          };

          return [];
        }
      );
    }

    vm.getApiKeys = getApiKeys;
    function getApiKeys() {
      msApi.request('products.payments.transactions.apiKeys@get', {userPublicId: vm.currentUser}).then(
        function (response) {

          for(var i=0; i<response.length; i++){
            if (response[i].purpose === 'TEST' && response[i].type === 'PUBLISHABLE') {
              vm.keys.test.publishable = response[i].value;
            } else if (response[i].purpose === 'TEST' && response[i].type === 'SECRET') {
              vm.keys.test.secret = response[i].value;
            } else if (response[i].purpose === 'LIVE' && response[i].type === 'PUBLISHABLE') {
              vm.keys.live.publishable = response[i].value;
            } else if (response[i].purpose === 'LIVE' && response[i].type === 'SECRET') {
              vm.keys.live.secret = response[i].value;
            }
          }
        },
        function (response) {
          return [];
        }
      );
    }

    vm.getStatuses = getStatuses;
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

    var getStuff = function (sSource, aoData, fnCallback, oSettings) {
      var currentPageIndex = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength);
      /**
       * pagination params form the datable drawn
       */
      var draw = aoData[0].value;
      var order = aoData[2].value;
      var start = aoData[3].value;
      var length = aoData[4].value;
      var search = aoData[5].value;

      $rootScope.loadingProgress = true;
      var queryParams = {
        userPublicId: vm.currentUser,
        page: currentPageIndex + 1,
        size: length
      };

      if (search.value !== '') {
        queryParams.userPublicId = search.value;
        msApi.request('products.payments.transactions@get', queryParams).then(
          function (response) {
            $rootScope.loadingProgress = false;
            var records = {
              'draw': draw,
              'recordsTotal': response.totalElements,
              'recordsFiltered': response.totalElements,
              'data': response.content ? response.content : []
            };
            fnCallback(records);
          },
          function (response) {
            toastNotification('Error connecting to server. Please try again shortly.');
            $rootScope.loadingProgress = false;
          }
        );
      } else {
        delete queryParams.userPublicId;
        msApi.resolve('products.payments.transactions@get', queryParams).then(
          function (response) {
            //log success messages and return the response
            $rootScope.loadingProgress = false;
            var records = {
              'draw': draw,
              'recordsTotal': response.totalElements,
              'recordsFiltered': response.totalElements,
              'data': response.content ? response.content : []
            };
            return records;
          },
          function (response) {
            //log error message and return an empty response, so that the view can load
            toastNotification('Error connecting to server. Please try again shortly.');
          });
      }
    };

    vm.dtInstance = {};
    vm.dtOptions = {
      withFnServerData: getTransactions(),
      dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs  : [
        {
          // Target the id column
          targets: 0,
          visible: false
        },
        {
          // Target the status column
          targets: 6,
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
      order       : [[0, 'desc']],
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
      getTransactions();
    }

    // Methods
    vm.getPaymentStatus = getPaymentStatus;
    vm.paymentActions = paymentActions;
    vm.submitTestPayment = submitTestPayment;
    vm.openRefundDialog = openRefundDialog;

    //////////

    init();

    function init() {
      getApiKeys();
      getStatuses();

      vm.today = new Date();

      vm.maxDate = new Date(
        vm.today.getFullYear(),
        vm.today.getMonth(),
        vm.today.getDate());
    }

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
          vm.transactions(aData);
        });
      });
      return nRow;
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
     * Refund payment
     */
    function paymentActions(){
      api.payments.refund.save(vm.transactions.id,
        function(response){
          toastNotification("Success in refunding the payment");
        },
        function(response){
          toastNotification("Error in refunding the payment. Please try again");
        });
    }

    /**
     * Submit Test Payment
     */
    function submitTestPayment() {
      vm.accountEndpoint = $resource(api.baseUrl + 'payments/getConfirmAccount', {}, {'get': {method: 'GET', headers: {"Api-Key": vm.keys.test.publishable}}});
      vm.accountEndpoint.get(
        function (response) {
          vm.account = response;

          postPayment();
        },
        function (response) {

        }
      );
    }

    vm.postPayment = postPayment;
    function postPayment() {
      vm.payload = {
        confirmationCode: "LYET673VGT6367",
        confirmAccount: vm.account.value,
        currency: "KES",
        amount: 500,
        description: "Chiffon blouse",
        transactionOption: "MOBILEMONEY",
        transactionService: "AIRTELMONEY",
        cardToken: "",
        customer: {
          email: "john.doe@brillantpay.com",
          phoneNumber: 254780112233
        }
      };

      var testData = vm.payload;

      showTestDialog(testData);

      vm.apiEndpoint = $resource(api.baseUrl + 'payments', {}, {'save': {method: 'POST', headers: {"Api-Key": vm.keys.test.secret}}});
      vm.apiEndpoint.save(vm.payload,
        function (response) {
          toastNotification("Payment created successfully. Reload to view");
        },
        function (response) {
          toastNotification("Error in creating payment. Please try again");
        }
      );
    }

    function showTestDialog(testData, ev) {
      $mdDialog.show({
        controller         : 'TransactionsController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/products/payments/transactions/dialogs/test/test.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          Test : testData,
          TestData: vm.payload,
          event: ev
        }
      });
    }

    /**
     * Open new task dialog
     *
     * @param ev
     * @param transaction
     */
    function openRefundDialog(ev, transaction)
    {
      $mdDialog.show({
        controller         : 'RefundDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/products/payments/transactions/dialogs/refund/refund.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          Refund : transaction,
          Refunds: vm.transactions.content,
          event: ev
        }
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
