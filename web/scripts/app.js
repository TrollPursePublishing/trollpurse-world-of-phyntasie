'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
angular.module('app', ['ngRoute', 'app.filters', 'app.services', 'app.directives', 'app.controllers', 'ui.bootstrap'])
    .value('$', $)

    // Gets executed during the provider registrations and configuration phase. Only providers and constants can be
    // injected here. This is to prevent accidental instantiation of services before they have been fully configured.
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
        .when('/credits', {
            templateUrl: 'view/credits.html'
        })
        .when('/events', {
            templateUrl: 'view/events.html',
            controller: 'HomeCtrl'
        })
        .when('/manual', {
            templateUrl: 'view/manual.html'
        })
        .when('/play', {
            templateUrl: 'view/gamenew.html',
            controller: 'CommandCtrl'
        })
        .when('/', {
            templateUrl: 'view/main.html',
        })
        .when('/login', {
            templateUrl: 'view/login.html',
            controller: 'LoginCtrl'
        })
        .when('/signup', {
            redirectTo: 'login'
        })
        .when('/userwelcome', {
            templateUrl: 'view/userwelcome.html',
            controller: 'UserCtrl',
        })
        .when('/404', {
            templateUrl: 'view/404.html'
        })
        .otherwise({
            redirectTo: '/404'
        })

    }])