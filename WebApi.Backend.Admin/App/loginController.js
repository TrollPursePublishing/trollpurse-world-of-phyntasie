(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$location', '$http', 'authService'];

    function loginController($scope, $location, $http, authService) {
        $scope.title = 'loginController';
        $scope.error = '';

        activate();

        function activate() {
            if (localStorage['__token'] != undefined) {
                $location.path('/edit');
            }
        }

        $scope.login = function () {
            authService.login($scope.username, $scope.password)
            .then(function (good) {
                localStorage['__token'] = angular.toJson(good.data);
                $http.defaults.headers.common.Authorization = 'Bearer ' + angular.fromJson(localStorage.getItem('__token')).access_token;
                $location.path('/edit');
            }, function (bad) {
                var res = angular.fromJson(bad);
                $scope.error = res.statusText + ': ';
                if(angular.isDefined(res.data.error))
                {
                    $scope.error += res.data.error;
                }
            });
        }
    }
})();
