'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
//angular.module('DKOpenChat.services', []).
//  value('version', '0.1');



//var app = angular.module('DKOpenChat');

//dkOpenChatServices.factory('Room', ['$resource',
//  function($resource){
//    return $resource('rooms/', {}, {
//      query: {method:'GET', isArray:true}
//    });
//  }]);
//
//
//var services = angular.module('DKOpenChat.services', []);
//services.service('kkk', function () { /* ... */ });
//

//app.factory('kkk', ['$resource',
//    function($resource){
//        return $resource('rooms/', {}, {
//            query: {method:'GET', isArray:true}
//        });
//    }]);





//services.service('room', function($http) {
//  var promise;
//  var myService = {
//    async: function() {
//      if ( !promise ) {
//        // $http returns a promise, which has a then function, which also returns a promise
//        promise = $http.get('test.json').then(function (response) {
//          // The then function here is an opportunity to modify the response
//          console.log(response);
//          // The return value gets picked up by the then in the controller.
//          return response.data;
//        });
//      }
//      // Return the promise to the controller
//      return promise;
//    }
//  };
//  return myService;
//});


//dkOpenChatServices.factory('Room', ['$http', '$log', '$q'],function($http, $log, $q) {
//  return {
//    getRooms: function() {
//      var deferred = $q.defer();
//      $http.get('/rooms')
//          .success(function(data) {
//            deferred.resolve({
//              title: data.title,
//              cost: data.price});
//          }).error(function(msg, code) {
//            deferred.reject(msg);
//            $log.error(msg, code);
//          });
//      return deferred.promise;
//    }
//  }
//});
