'use strict';

var app = angular.module("DKOpenChat", []);
app.service('apiService', function ($http) {
  var promise;
  var myService = {
    getRooms: function() {
      if ( !promise ) {
        // $http returns a promise, which has a then function, which also returns a promise
        promise = $http.get('/api/rooms').then(function (response) {
          // The then function here is an opportunity to modify the response
          console.log(response);
          // The return value gets picked up by the then in the controller.
          return response.data;
        });
      }
      // Return the promise to the controller
      return promise;
    },
    postRoom: function(name, url) {
        var promise = $http.post('/api/rooms', { name: name, url: url }).then(function (response) {
            console.log(response);
            return response.data;
        });
        return promise;
    }
  };
  return myService;
});


app.controller("AppCtrl", function($scope, $http, apiService) {
  $scope.rooms = [];

  $scope.form = { name: "", url: "" };

  $scope.isValidForm = function () {
    return ($scope.form.name && $scope.form.url);
  }

  $scope.createRoom = function (name, url) {

  };

  // data initialize
  apiService.getRooms().then(function(result) {
      $scope.rooms = result;
      //if (!$scope.$$phase) $scope.$apply();
  }, function(err) {
      console.log("request error");
  });


    // pagination control
    $scope.totalItems = 64;
    $scope.currentPage = 4;
    $scope.maxSize = 5;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;


});