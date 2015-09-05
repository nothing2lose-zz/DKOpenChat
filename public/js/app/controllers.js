'use strict';

var app = angular.module("DKOpenChat", []);

/* WARNNING */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

// API
app.service('apiService', function ($http) {
    var cachedItems = [];
    var lastItem = function () {
        if (cachedItems.length > 0) {
            return cachedItems[cachedItems.length - 1]
        }
        return {}
    }
    var myService = {
        reset: function() {
            cachedItems.length = 0;
        },
        items: function () {
            return cachedItems;
        },
        getCategories: function() {
            var promise = $http.get('/api/categories').then(function (response) {
                return response.data;
            });
            return promise;
        },
        getRooms: function(categoryType, limit) {
            var last = lastItem();
            //console.log("====== last");
            //console.log(last);
            var promise;
            //if ( !promise ) {
                // $http returns a promise, which has a then function, which also returns a promise
                promise = $http.get('/api/rooms',{ params: { category_type: categoryType, start_at: last.created, limit: limit  } }).then(function (response) {
                    // The then function here is an opportunity to modify the response
                    //console.log(response);
                    // The return value gets picked up by the then in the controller.
                    //cachedItems = response.data;
                    cachedItems = cachedItems.concat(response.data);
                    return response.data;
                });
            //}
            // Return the promise to the controller
            return promise;
        },
        postRoom: function(name, url, categoryType, userId) {
            var promise = $http.post('/api/rooms', { name: name, url: url, category_type: categoryType, author_id: userId }).then(function (response) {
                cachedItems.insert(0, response.data);
                return response.data;
            });
            return promise;
        },
        deleteRoom: function(room) {
            var promise = $http.delete('/api/rooms/' + room._id).then(function (response) {
                cachedItems.insert(0, response.data);
                return response.data;
            });
            return promise;
        }
    };
    return myService;
});

// Kakao
app.service('kakaoService', function($rootScope) {
    Kakao.init('8e733c4e965021e9c7775cf635eba63f');
    var local = { authorized : false, userInfo : {} };
    var authorized = function () { return local.authorized };
    var setAuthorized = function ( isAuthorized ) {
        local.authorized = isAuthorized;
        $rootScope.$broadcast("didChangeAuthState", isAuthorized);
    }
    var userInfo = function() { return local.userInfo };

    var svc = {
        authorized: authorized,
        userInfo: userInfo,
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
                setAuthorized(false);
                console.log("-- logout");
                cb(null, null);
            });
        },
        getUserInfo: function(cb) {
            Kakao.API.request({
                url: "/v1/user/me",
                success: function(info) {
                    local.userInfo = info;
                    setAuthorized(true);
                    //console.log("user nfo ----");
                    //console.log(local.userInfo);
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

app.controller('RoomCreateFormCtrl', function($rootScope, $scope, apiService, kakaoService) {
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
        var userInfo = kakaoService.userInfo();
        var userId = userInfo.id;
        if (!userId) {
            alert("로그인을 먼저 해주세요");
            return;
        }
        console.log("==== userid : " + userId);
        apiService.postRoom($scope.form.name, $scope.form.url, $scope.selectedCategory.type, userId).then(
            function(result){
                $rootScope.$broadcast("didChangeRoomData");
            },
            function (err) {
                alert(JSON.stringify(err.data));
                console.log("====== fail to create!");
            });
    };
});

app.controller("AppCtrl", function($rootScope, $scope, $http, apiService, kakaoService) {
    var pageLimit = 100;
    $scope.reachOfEnd = false;
    $scope.rooms = []; // room list
    $scope.form = { name: "", url: "" }; // post room form
    $scope.selectedMenu = {}; // for get request
    $scope.reset = function () { // refresh
        $scope.rooms.length = 0;
        $scope.reachOfEnd = false;
    }

    $rootScope.$on('didChangeAuthState', function(event, authorized) {
        //console.log("========= auth state changed!");
        if (!$scope.$$phase) $scope.$apply();
    });

    $rootScope.$on('didLoadCategory', function(event, currentMenu, menus) {
        $scope.loadRooms();
    });

    $rootScope.$on('didChangeCategory', function(event, selectedMenu, menus) {
        $scope.selectedMenu = selectedMenu;

        $scope.reset();
        apiService.reset();
        //console.log("==== retreive menu changed notification "+ menuIndex);
        $scope.loadRooms();
    });

    $rootScope.$on('didChangeRoomData', function(event) {
        $scope.rooms = apiService.items();
    });

    $scope.isMyRoom = function(index) {
        var room = $scope.rooms[index];
        if (kakaoService.authorized()) {
            var userInfo = kakaoService.userInfo();
            return room.author_id === userInfo["id"];
        } else {
            return false;
        }
    }

    /**
     * scroll end event */
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            //alert("bottom!");

            if (false === $scope.reachOfEnd) {
                console.log("more load! : " + $scope.rooms.length);
                $scope.loadRooms();
            }

        }
    });
    /* === */

    // API
    $scope.loadRooms = function() {
        // data initialize
        var categoryType = $scope.selectedMenu.type;
        apiService.getRooms(categoryType, pageLimit).then(function(result) {
            //$scope.rooms.concat(result);
            //console.log();
            $scope.rooms = $scope.rooms.concat(result);
            console.log(result);
            if (result.length < pageLimit) {
                console.log("======= reach of end!?");
                $scope.reachOfEnd = true;
            }
            //if (!$scope.$$phase) $scope.$apply();
        }, function(err) {
            console.log("request error");
        });
    };

    $scope.deleteRoom = function(index) {
        if ($scope.isMyRoom(index)) {
            var room = $scope.rooms[index];
            apiService.deleteRoom(room).then(function(result) {
                $scope.loadRooms(); // remove index?
            },
            function(err){
                alert("삭제에 실패하였습니다.");
            });
        } else {
            alert("내 소유의 방이 아닙니다.");
        }

    }

});

app.controller("AuthCtrl", function($scope, kakaoService) {
    $scope.authorized = false;
    $scope.auth = function() {
        kakaoService.auth(function(err, result) {
            if (null === err && result) {
                $scope.authorized = true;
                if (!$scope.$$phase) $scope.$apply();

                kakaoService.getUserInfo(function(err, result){
                    if (result) {

                    }
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


app.directive('ngConfirmClick', [
    function(){
        return {
            priority: -1,
            restrict: 'A',
            link: function(scope, element, attrs){
                element.bind('click', function(e){
                    var message = attrs.ngConfirmClick;
                    if(message && !confirm(message)){
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        }
    }
]);