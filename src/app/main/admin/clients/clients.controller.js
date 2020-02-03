(function ()
{
  'use strict';

  angular
    .module('app.admin-clients')
    .controller('AdminClientsController', AdminClientsController);

  /** @ngInject */
  function AdminClientsController(Statuses, Clients, $mdDialog, $document, $state, $scope, Idle, Keepalive)
  {
    var vm = this;

    // Data
    vm.clients = Clients.data;
    vm.statuses = Statuses.data;

    vm.currentClient = null;

    vm.dtInstance = {};
    vm.dtOptions = {
      dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs  : [
        {
          // Target the id column
          targets: 0,
          width  : '72px'
        },
        {
          // Target the accounts column
          targets: 4,
          width  : '35px'
        },
        {
          // Target the status column
          targets: 6,
          render : function (data, type)
          {
            if ( type === 'display' )
            {
              var clientStatus = vm.getClientStatus(data);
              return '<span class="status ' + clientStatus.color + '">' + clientStatus.name + '</span>';
            }

            if ( type === 'filter' )
            {
              return vm.getClientStatus(data).name;
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
    vm.getClientStatus = getClientStatus;
    vm.openClient = openClient;

    //////////

    init();

    /**
     * Initialize
     */
    function init() {
      // Open the thread if needed
      if ($state.params.clientId) {
        for (var i = 0; i < vm.clients.length; i++) {
          if (vm.clients[i].id === $state.params.clientId) {
            vm.openClient(vm.clients[i]);
            break;
          }
        }
      }
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
     * Get client status
     *
     * @param id
     * @returns {*}
     */
    function getClientStatus(id)
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
     * Open single client
     */
    function openClient(id)
    {
      $state.go('app.admin-clients.client', {id: id});
    }
  }
})();
