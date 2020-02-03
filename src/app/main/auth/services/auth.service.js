/**
 * Created by TONNIE on 3/12/2017.
 */
(function () {
  'use strict';

  angular
    .module('app.auth.login')
    .factory('AuthService', AuthService);

  /** @ngInject */
  function AuthService($httpParamSerializer, api, $http, localStorageService, $q, $rootScope) {

    var vm = this;

    var service = {
      loggedIn: false,
      userPermissions: [],
      setUser: setUser,
      setSession: setSession,
      clearSession: clearSession,
      setUserPermissions: setUserPermissions,
      getUserPermissions: getUserPermissions,
      errorMessages: {},
      login: login
    };

    /**
     * Login()
     *
     * Will make an API call to authenticate a user from login form
     *
     * @param email - email to authenticate
     * @param password - password entered
     * @param callback
     *
     */
    function login(email, password, callback) {
      var payloadData = {
        grant_type: "password",
        username: email,
        password: password,
/*
        gRecaptchaResponse: gRecaptchaResponse,
*/
        client_id: "web-app"
      };

      payloadData = $httpParamSerializer(payloadData);

      api.userLogin.login(payloadData,
        function (response) {// Success
          if (response.access_token) {

            // store username and token in cookie to keep user logged in between page refreshes
            setSession(response);

            // Set user to $rootScope
            $rootScope.user = setSession(response);

            // add jwt token to auth header for all requests made by the $http service
            $http.defaults.headers.common.Authorization = 'Bearer ' + response.access_token;

            service.loggedIn = true;

            callback(true);
          } else {

            // execute callback with false to indicate failed login
            callback(false);
          }
        },
        // Error
        function (response) {
          service.errorMessages = response;
          service.loggedIn = false;
          callback(true);
        }
      );
    }

    function setUser() {

    }

    function setSession(data) {
      localStorageService.set('AT', angular.toJson(data.access_token));
      localStorageService.set('RT', angular.toJson(data.refresh_token));
      localStorageService.set('EXP', data.expires_in);
      localStorageService.set('publicId', data.publicId);
      localStorageService.set('RLS', angular.toJson(data.roles));
      localStorageService.set('fN', data.firstName);
      localStorageService.set('lN', data.lastName);
      localStorageService.set('flN', data.fullName);
      localStorageService.set('UN', data.username);
      localStorageService.set('LMOD', data.liveMode);

      var livemode = localStorageService.get('LMOD');
      if (livemode === true) {
        data.authorities.push("IS_LIVE");
      } else if (livemode === false) {
        data.authorities.push("IS_TEST");
      }

      localStorageService.set('PMS', angular.toJson(data.authorities));
      setUserPermissions(data.authorities);
      return;
    }

    function clearSession() {
      // remove user from cookie and clear http auth header
      var cookies = localStorageService.clearAll();
      /*angular.forEach(cookies, function (v, k) {
        $cookies.remove(k);
      });*/

      // delete rootScope data
      delete $rootScope.user;

      service.loggedIn = false;
      $http.defaults.headers.common.Authorization = '';
      return;
    }

    /**
     * Function for saving permission in user service session and on angular
     */
    function setUserPermissions(permissions) {
      service.userPermissions = permissions;
      return;
    }

    /**
     * Function for getting user permissions
     */
    function getUserPermissions() {
      return service.userPermissions;
    }

    return service;
  }
})();
