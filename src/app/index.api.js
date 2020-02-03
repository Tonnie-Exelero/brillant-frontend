(function ()
{
  'use strict';

  angular
    .module('fuse')
    .factory('api', apiService);

  /** @ngInject */
  function apiService($resource, localStorageService, $stateParams, $cookies)
  {
    /**
     * You can use this service to define your API urls. The "api" service
     * is designed to work in parallel with "apiResolver" service which you can
     * find in the "app/core/services/api-resolver.service.js" file.
     *
     * You can structure your API urls whatever the way you want to structure them.
     * You can either use very simple definitions, or you can use multi-dimensional
     * objects.
     *
     * Here's a very simple API url definition example:
     *
     *      api.getBlogList = $resource('http://api.example.com/getBlogList');
     *
     * While this is a perfectly valid $resource definition, most of the time you will
     * find yourself in a more complex situation where you want url parameters:
     *
     *      api.getBlogById = $resource('http://api.example.com/blog/:id', {id: '@id'});
     *
     * You can also define your custom methods. Custom method definitions allow you to
     * add hardcoded parameters to your API calls that you want to sent every time you
     * make that API call:
     *
     *      api.getBlogById = $resource('http://api.example.com/blog/:id', {id: '@id'}, {
         *         'getFromHomeCategory' : {method: 'GET', params: {blogCategory: 'home'}}
         *      });
     *
     * In addition to these definitions, you can also create multi-dimensional objects.
     * They are nothing to do with the $resource object, it's just a more convenient
     * way that we have created for you to packing your related API urls together:
     *
     *      api.blog = {
         *                   list     : $resource('http://api.example.com/blog'),
         *                   getById  : $resource('http://api.example.com/blog/:id', {id: '@id'}),
         *                   getByDate: $resource('http://api.example.com/blog/:date', {id: '@date'}, {
         *                       get: {
         *                            method: 'GET',
         *                            params: {
         *                                getByDate: true
         *                            }
         *                       }
         *                   })
         *       }
     *
     * If you look at the last example from above, we overrode the 'get' method to put a
     * hardcoded parameter. Now every time we make the "getByDate" call, the {getByDate: true}
     * object will also be sent along with whatever data we are sending.
     *
     * All the above methods are using standard $resource service. You can learn more about
     * it at: https://docs.angularjs.org/api/ngResource/service/$resource
     *
     * -----
     *
     * After you defined your API urls, you can use them in Controllers, Services and even
     * in the UIRouter state definitions.
     *
     * If we use the last example from above, you can do an API call in your Controllers and
     * Services like this:
     *
     *      function MyController (api)
     *      {
         *          // Get the blog list
         *          api.blog.list.get({},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *
         *          // Get the blog with the id of 3
         *          var id = 3;
         *          api.blog.getById.get({'id': id},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *
         *          // Get the blog with the date by using custom defined method
         *          var date = 112314232132;
         *          api.blog.getByDate.get({'date': date},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *      }
     *
     * Because we are directly using $resource service, all your API calls will return a
     * $promise object.
     *
     * --
     *
     * If you want to do the same calls in your UI Router state definitions, you need to use
     * "apiResolver" service we have prepared for you:
     *
     *      $stateProvider.state('app.blog', {
         *          url      : '/blog',
         *          views    : {
         *               'content@app': {
         *                   templateUrl: 'app/main/apps/blog/blog.html',
         *                   controller : 'BlogController as vm'
         *               }
         *          },
         *          resolve  : {
         *              Blog: function (apiResolver)
         *              {
         *                  return apiResolver.resolve('blog.list@get');
         *              }
         *          }
         *      });
     *
     *  You can even use parameters with apiResolver service:
     *
     *      $stateProvider.state('app.blog.show', {
         *          url      : '/blog/:id',
         *          views    : {
         *               'content@app': {
         *                   templateUrl: 'app/main/apps/blog/blog.html',
         *                   controller : 'BlogController as vm'
         *               }
         *          },
         *          resolve  : {
         *              Blog: function (apiResolver, $stateParams)
         *              {
         *                  return apiResolver.resolve('blog.getById@get', {'id': $stateParams.id);
         *              }
         *          }
         *      });
         *
         *  And the "Blog" object will be available in your BlogController:
         *
         *      function BlogController(Blog)
         *      {
         *          var vm = this;
         *
         *          // Data
         *          vm.blog = Blog;
         *
         *          ...
         *      }
         */

    var vm = this;
    vm.currentUser = localStorageService.get('publicId');
    vm.theToken = $stateParams.code;

    var api = {};
    var encodedHeader = btoa("web-app:webtrawler");
    var loginHeaders = {
      "Authorization": "Basic " + encodedHeader,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    };
    var signupHeaders = {
      "Authorization": "Basic " + encodedHeader,
      "Content-Type": "application/json; charset=utf-8"
    };
    var requestHeaders = {
      "Authorization": "Basic " + encodedHeader
    };
    var testApiKey = {
      "Api-Key": localStorageService.get('PS')
    };
    var testSecretKey = {
      "Api-Key": localStorageService.get('SS')
    };

    // Base Url
    api.baseUrl = 'http://dashboard.brillantpay.com:8080/api/v1/';

    //////////////API ENDPOINTS////////////////

    // Authentication
    api.userLogin   = $resource(api.baseUrl + 'uaa/oauth/token', {}, {login: {'method':'POST', headers: loginHeaders}});
    api.userSignup  = $resource(api.baseUrl + 'uaa/users/register', {}, {newUser: {'method':'POST', headers: signupHeaders}});

    // Users
    api.users = {
      "profile": $resource(api.baseUrl + 'users/:userPublicId', {userPublicId: vm.currentUser}, {update: {'method': 'PATCH'}}),
      "kyc": $resource(api.baseUrl + 'users/:userPublicId/kyc', {userPublicId: vm.currentUser}, {update: {'method': 'PATCH'}}),
      "bank": $resource(api.baseUrl + 'users/:userPublicId/bankAccounts', {userPublicId: vm.currentUser}, {add: {'method': 'POST'}}),
      "card": $resource(api.baseUrl + 'users/:userPublicId/card', {userPublicId: vm.currentUser}, {add: {'method': 'POST'}}),
      "mobile": $resource(api.baseUrl + 'users/:userPublicId/addMobile', {userPublicId: vm.currentUser}, {add: {'method': 'POST'}}),
      "resend_confirm": $resource(api.baseUrl + 'uaa/users/resendAccountVerification?email=:email', {email: '@email'}, {get: {'method': 'GET', headers: requestHeaders}})
    };

    // Payments
    api.payments = {
      "account": $resource(api.baseUrl + 'payments/getConfirmAccount', {}, {'get': {method: 'GET', headers: testApiKey}}),
      "payments": $resource(api.baseUrl + 'payments', {}, {'save': {method: 'POST', headers: testSecretKey}}),
      "refund" : $resource(api.baseUrl + 'payments', {userPublicId: vm.currentUser}, {'save': {'method': 'POST'}}),
      "approve": $resource(api.baseUrl + 'transactions/:transactionPublicId/confirmMobile', {transactionPublicId: '@transactionPublicId'}, {'save': {'method': 'POST'}})
    };

    // Wallet
    api.wallet = {
      "withdraw": $resource(api.baseUrl + 'accounts/:userPublicId/withdraw', {userPublicId: '@userPublicId'}, {'request': {method: 'POST'}})
    };

    //Shortcuts
    api.shortcuts = $resource(api.baseUrl + 'account/shortcuts');

    return api;
  }
})();
