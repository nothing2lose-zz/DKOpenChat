'use strict';

var app = angular.module("DKOpenChat", []);

/* WARNNING */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

// API
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
            return response.data;
        });
        return promise;
    }
  };
  return myService;
});

// Kakao
app.service('kakaoService', function() {
    Kakao.init('8e733c4e965021e9c7775cf635eba63f');
    var svc = {
        login:  function(cb) {
            Kakao.Auth.login({
                success: function (authObj) {
                    console.log(JSON.stringify(authObj, null, 4));
                    cb(null, authObj);
                },
                fail: function (err) {
                    //alert(JSON.stringify(err))
                    cb(err, null);
                }
            });
        }
    };
    return svc;
});


app.controller("AppCtrl", function($scope, $http, apiService, kakaoService) {
  $scope.rooms = []; // room list
  $scope.form = { name: "", url: "" }; // post room form

  $scope.createRoom = function () {
      apiService.postRoom($scope.form.name, $scope.form.url).then(

          function(result){
              $scope.rooms.insert(0, result)
          },
          function (err) {
              alert(JSON.stringify(err.data));
              console.log("====== fail to create!");
          });
  };

  // data initialize
  apiService.getRooms().then(function(result) {
      $scope.rooms = result;
      //if (!$scope.$$phase) $scope.$apply();
  }, function(err) {
      console.log("request error");
  });



});

app.controller("AuthCtrl", function($scope, kakaoService) {
    $scope.authorized = false;
    $scope.login = function() {
        kakaoService.login(function(err, result) {
            if (null === err && result) {
                $scope.authorized = true;
                if (!$scope.$$phase) $scope.$apply();
            }
            console.log("kakao login result");
            console.log(result);
        })
    }
});