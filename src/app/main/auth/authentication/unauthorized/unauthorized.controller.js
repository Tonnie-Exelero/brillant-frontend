(function ()
{
    'use strict';

    angular
        .module('app.auth.unauthorized')
        .controller('UnauthorizedController', UnauthorizedController);

    /** @ngInject */
    function UnauthorizedController($rootScope, $state)
    {
      var vm = this;

      // Data

      // Methods
      vm.goBack = goBack;


      //////////////////////////////////
      /**
       * Go back
       */
      function goBack() {
        $state.go($rootScope.previousState.name);
      }
    }
})();
