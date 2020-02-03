(function ()
{
  'use strict';

  angular
    .module('fuse')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $timeout, $state, editableThemes, editableOptions, $document)
  {
    // 3rd Party Dependencies
    editableThemes.default.submitTpl = '<md-button class="md-icon-button" type="submit" ng-click="vm.updateData()" aria-label="save"><md-icon md-font-icon="icon-checkbox-marked-circle" class="md-accent-fg md-hue-1"></md-icon></md-button>';
    editableThemes.default.cancelTpl = '<md-button class="md-icon-button" ng-click="$form.$cancel()" aria-label="cancel"><md-icon md-font-icon="icon-close-circle" class="icon-cancel"></md-icon></md-button>';

    // Activate loading indicator
    var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function ()
    {
      $rootScope.loadingProgress = true;
    });

    // De-activate loading indicator
    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
    {
      $timeout(function ()
      {
        $rootScope.loadingProgress = false;
      });
    });

    // Store state in the root scope for easy access
    $rootScope.state = $state;

    // Cleanup
    $rootScope.$on('$destroy', function ()
    {
      stateChangeStartEvent();
      stateChangeSuccessEvent();
    });

    /////////////////////////////////////////////////////////////
    //////////////// Watch for Idleness /////////////////////////
    /////////////////////////////////////////////////////////////

    /*// Timeout timer value
     var TimeOutTimerValue = 5000;

     // Start a timeout
     var TimeOut_Thread = $timeout(function(){ LogoutByTimer() } , TimeOutTimerValue);
     var bodyElement = angular.element($document);

     angular.forEach(['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'],
     function(EventName) {
     bodyElement.bind(EventName, function (e) { TimeOut_Resetter(e) });
     });

     function LogoutByTimer(){

     if ($rootScope.state != [
     'app.auth_login',
     'app.auth_forgot-password',
     'app.auth_register',
     'app.auth_reset-password',
     'app.auth_unauthorized'
     ]) {

     // Lock session after timeout
     $state.go('app.auth_lock');

     } else {

     console.log('This is login mahn');
     }
     }

     function TimeOut_Resetter(e){

     /// Stop the pending timeout
     $timeout.cancel(TimeOut_Thread);

     /// Reset the timeout
     TimeOut_Thread = $timeout(function(){ LogoutByTimer() } , TimeOutTimerValue);
     }*/

    /////////////////////////////////////////////////////////////
    //////////////// End Watch for Idleness /////////////////////
    /////////////////////////////////////////////////////////////
  }
})();
