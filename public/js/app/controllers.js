'use strict';

var app = angular.module("DKOpenChat", []);

/* WARNNING */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

// API
app.service('apiService', function ($http) {
    var cachedItems = [];
    var myService = {
        items: function () {
            return cachedItems;
        },
        getCategories: function() {
            var promise = $http.get('/api/categories').then(function (response) {
                return response.data;
            });
            return promise;
        },
        getRooms: function(categoryType) {
            var promise;
            //if ( !promise ) {
                // $http returns a promise, which has a then function, which also returns a promise
                promise = $http.get('/api/rooms',{ params: { category_type: categoryType } }).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    //console.log(response);
                    // The return value gets picked up by the then in the controller.
                    cachedItems = response.data;
                    return response.data;
                });
            //}
            // Return the promise to the controller
            return promise;
        },
        postRoom: function(name, url, categoryType) {
            var promise = $http.post('/api/rooms', { name: name, url: url, category_type: categoryType }).then(function (response) {
                cachedItems.insert(0, response.data);
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
        auth: function(cb) {
            Kakao.Auth.login({
                persistAccessToken: true,
                success: function (authObj) {
                    console.log(JSON.stringify(authObj, null, 4));
                    cb(null, authObj);
                },
                fail: function (err) {
                    alert(JSON.stringify(err))
                    cb(err, null);
                }
            });
        },
        logout: function(cb) {
            Kakao.Auth.logout(function(){

                console.log("-- logout");
                cb(null, null);
            });
        },
        getUserInfo: function(cb) {
            Kakao.API.request({
                url: "/v1/user/me",
                success: function(info) {
                    cb(null, info);
                },
                fail: function(err) {
                    cb(err, null);
                }
            });
        }
    };
    return svc;
});

app.controller('MenuCtrl', function($rootScope, $scope, apiService) {
    $scope.menus = [];
    $scope.selectedMenuIndex = 0;

    $scope.buttonStyleClass = function(index) {
        if ($scope.selectedMenuIndex === index) {
            return "btn-success";
        } else {
            return "";
        }
    }

    $scope.getCurrentCategoryName = function() {
        var menu = $scope.menus[$scope.selectedMenuIndex];
        if (menu) {
            return $scope.menus[$scope.selectedMenuIndex].name;
        } else {
            return"";
        }
    }

    $scope.didSelectMenu = function(menuIndex) {
        var valueChanged = ($scope.selectedMenuIndex !== menuIndex);
        $scope.selectedMenuIndex = menuIndex;
        console.log("menu index : " + menuIndex);
        if (true === valueChanged) {
            // notify?
            $rootScope.$broadcast("didChangeCategory", $scope.menus[menuIndex], $scope.menus); // will be chagned.
        }
    }

    // TODO: menu load from API
    apiService.getCategories().then(function(data) {
        $scope.menus = data;
        $rootScope.$broadcast("didLoadCategory", $scope.menus[$scope.selectedMenuIndex], $scope.menus);
    });

});

app.controller('RoomCreateFormCtrl', function($rootScope, $scope, apiService) {
    $scope.menus = [];
    $scope.form = { name: "", url: "" }; // post room form
    $scope.selectedCategory = {};

    $rootScope.$on('didLoadCategory', function(event, currentMenu, menus) {
        $scope.menus = menus;
    });

    $scope.didSelectCategoryInCreateForm = function(menu) {
        $scope.selectedCategory = menu;
    }

    $scope.createRoom = function () {
        apiService.postRoom($scope.form.name, $scope.form.url, $scope.selectedCategory.type ).then(
            function(result){
                //
                $rootScope.$broadcast("didChangeRoomData");
            },
            function (err) {
                alert(JSON.stringify(err.data));
                console.log("====== fail to create!");
            });
    };
});

app.controller("AppCtrl", function($rootScope, $scope, $http, apiService, kakaoService) {

    $scope.rooms = []; // room list
    $scope.form = { name: "", url: "" }; // post room form
    $scope.selectedMenu = {}; // for get request

    $rootScope.$on('didLoadCategory', function(event, currentMenu, menus) {
        $scope.loadRooms();
    });

    $rootScope.$on('didChangeCategory', function(event, selectedMenu, menus) {
        $scope.selectedMenu = selectedMenu;
        //console.log("==== retreive menu changed notification "+ menuIndex);
        $scope.loadRooms();
    });

    $rootScope.$on('didChangeRoomData', function(event) {
        $scope.rooms = apiService.items();
    });



    // get room
    $scope.loadRooms = function() {
        // data initialize
        var categoryType = $scope.selectedMenu.type;
        apiService.getRooms(categoryType).then(function(result) {
            $scope.rooms = result;
            //if (!$scope.$$phase) $scope.$apply();
        }, function(err) {
            console.log("request error");
        });
    };

});

app.controller("AuthCtrl", function($scope, kakaoService) {
    $scope.authorized = false;
    $scope.auth = function() {
        kakaoService.auth(function(err, result) {
            if (null === err && result) {
                $scope.authorized = true;
                if (!$scope.$$phase) $scope.$apply();

                kakaoService.getUserInfo(function(err, result){

                });
            }
            console.log("kakao login result");
            console.log(result);
        })
    }
    $scope.logout = function() {
        kakaoService.logout(function(err, result){
            $scope.authorized = false;
            if (!$scope.$$phase) $scope.$apply();
        });
    }
});