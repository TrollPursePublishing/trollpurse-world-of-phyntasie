(function () {
    'use strict';

    angular
        .module('app')
        .service('authService', authService);

    authService.$inject = ['$http', '$location'];

    function authService($http, $location) {
        this.login = function (username, password) {
            return $http.post(
                '/token',
                $.param({ grant_type: 'password', username: username, password: password }),
                {
                    headers:
                      {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                      }
                }
            );
        }

        this.logout = function () {
            delete localStorage.__token;
            $location.path('/');
        }
    }
})();