'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
angular.module('app', ['ngRoute', 'app.filters', 'app.services', 'app.directives', 'app.controllers'])

    // Gets executed during the provider registrations and configuration phase. Only providers and constants can be
    // injected here. This is to prevent accidental instantiation of services before they have been fully configured.
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
        .when('/about', {
            templateUrl: 'view/about.html',
            controller: 'AboutCtrl'
        })
        .when('/adventure', {
            templateUrl: 'view/game.html',
            controller: 'CommandCtrl'
        })
        .when('/', {
            templateUrl: 'view/index.html',
            controller: 'HomeCtrl',
        })
        .when('/login', {
            templateUrl: 'view/login.html',
            controller: 'LoginCtrl'
        })
        .when('/ranks', {
            templateUrl: 'view/ranks.html',
            controller: 'RanksCtrl'
        })
        .when('/signup', {
            templateUrl: 'view/signup.html',
            controller: 'SignUpCtrl'
        })
        .when('/userwelcome', {
            templateUrl: 'view/userwelcome.html',
            controller: 'UserCtrl',
        })
        .otherwise({
            redirectTo: '/'
        })

    }]);

    //.run(['$rootScope', '$injector', function ($rootScope, $injector) {
    //    $injector.get("$http").defaults.transformRequest = function (data, headersGetter) {
    //        if ($rootScope.oauth) headersGetter()['Authorization'] = "Bearer " + $rootScope.oauth.access_token;
    //        if (data) {
    //            return angular.toJson(data);
    //        }
    //    };
    //}]);
