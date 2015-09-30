'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
angular.module('app', ['ngRoute'])

    // Gets executed during the provider registrations and configuration phase. Only providers and constants can be
    // injected here. This is to prevent accidental instantiation of services before they have been fully configured.
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
        .when('/', {
            templateUrl: 'view/Login.html',
            controller: 'loginController'
        })
        .when('/edit', {
            templateUrl: 'view/Edit.html',
            controller: 'editController'
        })
        .otherwise({
            redirectTo: '/'
        })

    }])

    .run(['$http', function ($http) {
        var token = angular.fromJson(localStorage.getItem('__token'));
        if (token != undefined)
            $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
    }]);