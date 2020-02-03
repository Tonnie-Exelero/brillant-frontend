(function ()
{
  'use strict';

  angular
    .module('app.users.profile')
    .controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController(api, msApi, localStorageService, $mdToast, Idle, Keepalive, $scope, $state)
  {
    var vm = this;

    // Data
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

    vm.currentUser = localStorageService.get('publicId');
    vm.fName = localStorageService.get('fN');
    vm.lName = localStorageService.get('lN');

    vm.getProfile = getProfile;
    function getProfile() {
      msApi.request('users.profile.about@get', {userPublicId: vm.currentUser}).then(
        function (response) {
          vm.profile = response;
        },
        function (response) {
          vm.profile = {
            firstName: "Err",
            lastName: "Err",
            email: "Err"
          };
        }
      );
    }

    // Methods
    vm.updateData = updateData;
    vm.fileAdded = fileAdded;
    vm.upload = upload;

    //////////

    init();
    function init() {
      getProfile();
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
     * Update function
     */
    function updateData() {
      // API call
      msApi.request('users.profile.update@patch', vm.profile, {userPublicId: vm.currentUser}).then(
        function (response) {
          toastNotification('Profile updated successfully');
        },
        function (response) {
          toastNotification('Error updating profile. Try again');
        }
      );
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
        location : '/assets/images/logos/',
        offline  : false
      };

      if(vm.profile.organization.logoUrl)
      {
        vm.profile.organization.logoUrl = uploadingFile.location;
      }

      // Append it to the file list
      vm.files.push(uploadingFile);

      // Call API to update
      api.users.update([vm.profile.organization.logoUrl, vm.files],
        function (response) {
          console.log("Successfully updated image.");
        },
        function (response) {
          console.error("There was an error. Please try again!");
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

    function toastNotification(data) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(data)
          .position('top right')
          .hideDelay(5000)
      );
    }
  }
})();
