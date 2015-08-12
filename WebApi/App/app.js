'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
angular.module('app', ['ngRoute', 'app.filters', 'app.services', 'app.directives', 'app.controllers'])
    .value('$', $)

    // Gets executed during the provider registrations and configuration phase. Only providers and constants can be
    // injected here. This is to prevent accidental instantiation of services before they have been fully configured.
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
        .when('/credits', {
            templateUrl: 'view/credits.min.html'
        })
        .when('/events', {
            templateUrl: 'view/events.min.html',
            controller: 'HomeCtrl'
        })
        .when('/manual', {
            templateUrl: 'view/manual.min.html'
        })
        .when('/adventure', {
            templateUrl: 'view/game.min.html',
            controller: 'CommandCtrl',
        })
        .when('/', {
            templateUrl: 'view/index.min.html',
        })
        .when('/login', {
            templateUrl: 'view/login.min.html',
            controller: 'LoginCtrl'
        })
        .when('/ranks', {
            templateUrl: 'view/ranks.min.html',
            controller: 'RanksCtrl'
        })
        .when('/signup', {
            templateUrl: 'view/login.min.html',
            controller: 'LoginCtrl'
        })
        .when('/userwelcome', {
            templateUrl: 'view/userwelcome.min.html',
            controller: 'UserCtrl',
        })
        .when('/external/account/donotdisturb/:hash', {
            templateUrl: 'view/externalaction.min.html',
            controller: 'AccountCtrl'
        })
        .when('/external/account/register/:hash/:confirmationCode', {
            templateUrl: 'view/register.min.html',
            controller: 'RegisterCtrl'
        })
        .when('/api/account/password/:hash/:securityStamp', {
            templateUrl: 'view/reset.min.html',
            controller: 'ResetCtrl'
        })
        .when('/404', {
            templateUrl: 'view/404.html'
        })
        .otherwise({
            redirectTo: '/404'
        })

    }])

    .run(['$http', function ($http) {
        var token = angular.fromJson(localStorage.getItem('aqg_token'));
        if (token != undefined)
            $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
    }]);