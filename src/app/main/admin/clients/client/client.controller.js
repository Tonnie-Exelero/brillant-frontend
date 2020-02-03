(function ()
{
  'use strict';

  angular
    .module('app.admin-clients')
    .controller('ClientController', ClientController);

  /** @ngInject */
  function ClientController(Statuses, Transactions, ApiKey, api, $mdToast)
  {
    var vm = this;

    // Data
    vm.transactions = Transactions.data;
    vm.statuses = Statuses.data;
    vm.apiKey = ApiKey.data;

    vm.dtInstance = {};
    vm.dtOptions = {
      dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs  : [
        {
          // Target the id column
          targets: 0,
          width  : '42px'
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
      pagingType  : 'simple',
      lengthMenu  : [10, 20, 30, 50, 100],
      pageLength  : 20,
      scrollY     : 'auto',
      responsive  : true
    };

    // Methods
    vm.getPaymentStatus = getPaymentStatus;
    vm.paymentActions = paymentActions;

    //////////

    /**
     * Get transaction status
     *
     * @param id
     * @returns {*}
     */
    function getPaymentStatus(id)
    {
      for ( var i = 0; i < vm.statuses.length; i++ )
      {
        if ( vm.statuses[i].id === parseInt(id) )
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
        toastNotificationSuccess();
      },
      function(response){
        toastNotificationError();
      })
    }

    vm.toastNotificationSuccess = toastNotificationSuccess;
    function toastNotificationSuccess() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Action successful.')
          .position('top right')
          .hideDelay(3000)
      );
    }

    vm.toastNotificationError = toastNotificationError;
    function toastNotificationError() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Error. Try again.')
          .position('top right')
          .hideDelay(3000)
      );
    }
  }
})();
