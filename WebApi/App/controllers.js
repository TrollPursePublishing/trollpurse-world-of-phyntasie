'use strict';

angular.module('app.controllers', ['app.services'])

    // Path: /
    .controller('CommandCtrl', ['$scope', '$location', '$window', 'UserService', 'CommandService', function ($scope, $location, $window, UserService, CommandService) {
        $scope.checkRerouteToUserpage = function () {
            if (!UserService.isLoggedIn) {
                $location.path('/');
                return false;
            }
            return true;
        };

        $scope.user = UserService.user;
        $scope.messages = [];
        $scope.currentDescription = {};
        $scope.navigation = {};

        $scope.submit = function (data) {
                CommandService.submit(data, $scope.user.Id)
                .then(function (data) {
                    var d = angular.fromJson(data.data);
                    for (var i = 0; i < d.messages.length; i++) {
                        $scope.messages.push(d.messages[i]);
                    }
                    $scope.user = d.player;
                    UserService.user = $scope.user;
                }, function (error) {
                    console.error('error', error);
                });
        };

        $scope.detailedView = function (descriptableObject) {
            delete descriptableObject.Id;
            $scope.currentDescription = descriptableObject;
        };
    }])

    .controller('HomeCtrl', ['$scope', '$location', '$window', 'RanksService', 'NotificationService', function ($scope, $location, $window, RankService, NotificationService) {
        $scope.$root.title = 'AdventureQuestGame';
        $scope.items = {};
        $scope.events = {};
        $scope.acheivements = {};

        $scope.getData = function () {
            NotificationService.getEvents()
            .then(function (data) {
                $scope.events = angular.fromJson(data.data).events;
            }, function (error) {
                console.error('error', error);
            });

            NotificationService.getAllPlayerAchievements()
            .then(function (data) {
                $scope.acheivements = angular.fromJson(data.data).pairs;
            }, function (error) {
                console.error('error', error);
            });

            RankService.get()
            .then(function (data) {
                $scope.items = angular.fromJson(data.data).pairs;
            }, function (error) {
                console.error('error', error);
            });
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.getData();
        });
    }])

    .controller('SignUpCtrl', ['$scope', '$location', '$window', 'UserService', function($scope, $location, $window, UserService){
        $scope.$root.title = 'AdventureQuestGame | Join Now!';
        $scope.error = {};
        $scope.hasError = false;

        $scope.signup = function (username, password, confirmpassword, email, gender) {
            UserService.register(username, password, confirmpassword, email, gender)
            .then(function (data) {
                $scope.error = {};
                $scope.hasError = false;
                $location.path('/login');
            }, function (error) {
                $scope.hasError = true;
                var result = angular.fromJson(error);
                $scope.error = angular.fromJson(result.ModelState);
            });
            return $scope.success;
        };

        $scope.checkRerouteToUserpage = function () {
            if (UserService.isLoggedIn) {
                $location.path('/userwelcome');
                return true;
            }
            return false;
        };
    }])

    // Path: /ranks
    .controller('RanksCtrl', ['$scope', '$location', '$window', 'RanksService', 'UserService', function ($scope, $location, $window, RanksService, UserService) {
        $scope.$root.title = 'AdventureQuestGame | Ranks';
        $scope.items = {};
        $scope.rankuser = {};
        $scope.isLoggedIn = UserService.isLoggedIn;

        $scope.getData = function(){
            RanksService.get()
            .then(function (data) {
                $scope.items = angular.fromJson(data.data).pairs;
            });

            if (UserService.isLoggedIn) {
                RanksService.getById(UserService.user.Id)
                .then(function (data) {
                    $scope.rankuser = angular.fromJson(data.data);
                    //console.log($scope.rankuser);
                });
            }
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.getData();
        });
    }])

    // Path: /about
    .controller('AboutCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'AdventureQuestGame | About';
    }])

    // Path: /login
    .controller('LoginCtrl', ['$scope', '$location', '$window', 'UserService', function ($scope, $location, $window, UserService) {
        $scope.$root.title = 'AdventureQuestGame | Sign In';
        $scope.user = {};
        $scope.isLoggedIn = false;
        $scope.authError = '';
        $scope.bAuthError = false;
        $scope.login = function (entereduserName, password) {
            UserService.login(entereduserName, password)
            .then(function (data) {
                var result = angular.fromJson(data.data);
                var msg = result.message;
                var b = !result.isError;
                $scope.bAuthError = result.isError;

                if (b) {
                    UserService.getPlayerData(msg)
                    .then(function (data) {
                        $scope.user = angular.fromJson(data.data);
                        UserService.user = $scope.user;
                        UserService.isLoggedIn = true;
                    }, function (error) {
                        $scope.user = {};
                        UserService.user = $scope.user;
                        UserService.isLoggedIn = false;
                    });
                }
                else {
                    $scope.authError = msg;
                }
            }, function (error) {
                $scope.user = {};
                UserService.user = $scope.user;
                UserService.isLoggedIn = false;
            });
        };

        $scope.checkRerouteToUserpage = function () {
            if (UserService.isLoggedIn) {
                $location.path('/userwelcome');
                return true;
            }
            return false;
        };

        $scope.$watch($scope.user, function (newValue, oldValue, scope) {
            if ($scope.user.Id !== undefined && UserService.isLoggedIn) {
                $location.path('/userwelcome');
            } else {
                $location.path('/login');
            }
        });
    }])

    // Path: /userwelcome
    .controller('UserCtrl', ['$scope', '$location', '$window', 'UserService', 'NotificationService', function ($scope, $location, $window, UserService, NotificationService) {
        $scope.$root.title = 'AdventureQuestGame | ' + UserService.userName;
        $scope.username = '';
        $scope.isLoggedIn = false;
        $scope.userImageUrl = '';
        $scope.user = {};
        $scope.acheivements = {};

        $scope.logout = function () {
            UserService.logout(UserService.user.Id)
            .then(function (data) {
                UserService.isLoggedIn = false;
                UserService.user = {};
                $scope.isLoggedIn = false;
                $scope.acheivements = {};
                $scope.username = '';
                $location.path('/');
            });
        };

        $scope.adventure = function () {
            $location.path('/adventure');
        };

        $scope.checkRerouteToUserpage = function () {
            if (!UserService.isLoggedIn) {
                $location.path('/');
                return false;
            } else {
                $scope.username = UserService.user.FullName;
                $scope.isLoggedIn = UserService.isLoggedIn;
                $scope.userImageUrl = UserService.getUserImage(UserService.user.Id);
                return true;
            }
            
        };

        $scope.getData = function () {
            NotificationService.getPlayerAcheivements(UserService.user.Id)
            .then(function (data) {
                $scope.acheivements = angular.fromJson(data.data);
            }, function (error) {
                console.error('error', error);
            });

            $scope.user = UserService.user;
            //console.log('user', $scope.user);
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.getData();
        });

    }])

    // Path: /error/404
    .controller('Error404Ctrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Error 404: Page Not Found';
    }]);