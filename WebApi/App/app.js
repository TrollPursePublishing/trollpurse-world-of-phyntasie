'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
angular.module('app', ['ngRoute', 'app.filters', 'app.services', 'app.directives', 'app.controllers'])
    .value('$', $)

    // Gets executed during the provider registrations and configuration phase. Only providers and constants can be
    // injected here. This is to prevent accidental instantiation of services before they have been fully configured.
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
        .when('/about', {
            templateUrl: 'view/about.min.html',
            controller: 'AboutCtrl'
        })
        .when('/adventure', {
            templateUrl: 'view/game.min.html',
            controller: 'CommandCtrl',
        })
        .when('/', {
            templateUrl: 'view/index.min.html',
            controller: 'HomeCtrl',
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
            templateUrl: 'view/signup.min.html',
            controller: 'SignUpCtrl'
        })
        .when('/userwelcome', {
            templateUrl: 'view/userwelcome.min.html',
            controller: 'UserCtrl',
        })
        .when('/View/*', {
            redirectTo: '/'
        })
        .otherwise({
            redirectTo: '/'
        })

    }]);