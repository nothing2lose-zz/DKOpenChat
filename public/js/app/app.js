'use strict';


// Declare app level module which depends on filters, and services
//angular.module('DKOpenChat', ['DKOpenChat.filters', 'DKOpenChat.services', 'DKOpenChat.directives','ngRoute']).
angular.module('DKOpenChat', ['ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', { controller: AppCtrl });
    //$routeProvider.when('/view2', {templateUrl: 'partial/2', controller: RoomCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);