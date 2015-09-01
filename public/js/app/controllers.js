'use strict';

/* Controllers */

angular.module("DKOpenChat", []).controller("AppCtrl", function($scope, $http) {
  console.log("----- loaded?");
  $http({method: 'GET', url: '/rooms'}).
      success(function(data, status, headers, config) {
        $scope.name = data.name;
      }).
      error(function(data, status, headers, config) {
        $scope.name = 'Error!'
      });


  Room.getRooms().then(function(result) {
    $scope.rooms = result;
    console.log(result);
  });
});


function CategoryCtrl() {
}
CategoryCtrl.$inject = [];


function RoomCtrl($scope, $http, Room) {
  $scope.rooms = [];
  Room.getRooms().then(function(result) {
    $scope.rooms = result;
  });

}
RoomCtrl.$inject = [];


