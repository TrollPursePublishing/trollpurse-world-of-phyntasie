'use strict';

angular.module('app.controllers', ['app.services'])

    // Path: /
    .controller('CommandCtrl', ['$scope', '$location', '$window', 'UserService', 'CommandService', 'MessageService', '$filter', function ($scope, $location, $window, UserService, CommandService, MessageService, $filter) {
        $scope.checkRerouteToUserpage = function () {
            if (!UserService.isLoggedIn) {
                $location.path('/');
                return false;
            }
            MessageService.startupServices()
            .then(function () { if (MessageService.chatConnected) { $scope.$parent.$emit('chatready'); } },
            function (error) { console.log('error', error); });
            return true;
        };

        $scope.user = UserService.user;
        $scope.messages = [];
        $scope.currentDescription = {};
        $scope.navigation = {};

        $scope.$parent.$on('chat', function (event, data) {
            console.log('chat', data.name + ':' + data.msg);
            $scope.$apply(function () {
                $scope.messages.push(data.name + ' said, ' + data.msg);
            });
        });

        $scope.$parent.$on('chatready', function () {
            console.log('chatready', 'initialized');
            MessageService.joinLocation(UserService.user.navigation.currentLocation.Id);
        });

        $scope.submit = function (data) {
            if (data.indexOf('"') === 0 && data.lastIndexOf('"') === data.length - 1) {
                MessageService.send($scope.user.FullName, data, $scope.user.navigation.currentLocation.Id);
            } else {
                MessageService.leaveLocation($scope.user.navigation.currentLocation.Id);
                CommandService.submit(data, $scope.user.Id)
                .then(function (data) {
                    var d = angular.fromJson(data.data);
                    for (var i = 0; i < d.messages.length; i++) {
                        $scope.messages.push(d.messages[i]);
                    }
                    $scope.user = d.player;
                    UserService.user = $scope.user;
                    MessageService.joinLocation($scope.user.navigation.currentLocation.Id);
                }, function (error) {
                    console.error('error', error);
                    MessageService.joinLocation($scope.user.navigation.currentLocation.Id);
                });
            }
        };

        $scope.detailedView = function (descriptableObject) {
            delete descriptableObject.Id;
            $scope.currentDescription = descriptableObject;
            angular.forEach(descriptableObject, function (value, key) {
                if (key.indexOf('$') < 0) {
                    $scope.messages.push($filter('property')(key) + ':   ' + value);
                }
            });
        };
    }])

    .controller('ResetCtrl', ['$scope', '$routeParams', '$window', 'AccountService', function ($scope, $routeParams, $window, AccountService) {
        $scope.$root.title = 'External Portal';
        $scope.result = {};
        $scope.enterResult = {};
        $scope.showClick = false;

        $scope.submitClick = function (password, confirmPassword) {
            $scope.showClick = (password == confirmPassword);
        };

        $scope.resetPassword = function (password, confirmPassword) {
            AccountService.resetPassword($scope.enterResult.additionalData, password, confirmPassword)
            .then(function (data) {
                console.log(data.data);
                $scope.showClick = false;
                $scope.result = angular.fromJson(data.data);
            }, function (error) {
                $scope.result = { msg: 'Reset not successful, please contact support. I\'m Sorry', success: false, additionalData: $scope.enterResult.additionalData };
            });
        }

        $scope.$on('$viewContentLoaded', function () {
            AccountService.resetConfirm($routeParams.hash, $routeParams.securityStamp)
            .then(function (data) {
                $scope.enterResult = angular.fromJson(data.data);
            }, function (error) {
                $scope.enterResult = { msg: 'Reset not successful, please contact support. I\'m Sorry', success: false };
            });
        });
    }])

    .controller('HomeCtrl', ['$scope', '$location', '$window', 'RanksService', 'NotificationService', 'gamename', function ($scope, $location, $window, RankService, NotificationService, gamename) {
        $scope.$root.title = gamename;
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

    .controller('SignUpCtrl', ['$scope', '$location', '$window', 'UserService', 'gamename', function ($scope, $location, $window, UserService, gamename) {
        $scope.$root.title = gamename + ' | Join Now!';
        $scope.error = {};
        $scope.hasError = false;
        $scope.registered = false;
        $scope.notification = '';
        $scope.hasClicked = false;
        $scope.pleasewait = 'Trying to register, please wait :D';

        $scope.signup = function (username, password, confirmpassword, email, gender) {
            $scope.hasClicked = true;
            UserService.register(username, password, confirmpassword, email, gender)
            .then(function (data) {
                console.log(data);
                $scope.error = {};
                $scope.hasError = false;
                $scope.registered = true;
                $scope.notification = data.data.Errors[0];
                $scope.hasClicked = false;
            }, function (error) {
                $scope.hasError = true;
                var result = angular.fromJson(error);
                console.log(result);
                $scope.error = angular.fromJson(result.ModelState);
                $scope.hasClicked = false;
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
    .controller('RanksCtrl', ['$scope', '$location', '$window', 'RanksService', 'UserService', '$filter', 'gamename', function ($scope, $location, $window, RanksService, UserService, $filter, gamename) {
        $scope.$root.title = gamename +' | Ranks';
        $scope.items = {};
        $scope.rankuser = {};
        $scope.isLoggedIn = UserService.isLoggedIn;
        $scope.rank = '';

        $scope.getData = function () {
            RanksService.getAll()
            .then(function (data) {
                $scope.items = $filter('orderBy')(angular.fromJson(data.data).pairs, '-score');
                if ($scope.isLoggedIn) {
                    for (var i = 0; i < $scope.items.length; ++i) {
                        if ($scope.items[i].name === UserService.user.FullName) {
                            $scope.rank = i + 1;
                            break;
                        }
                    }
                }
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
    .controller('AboutCtrl', ['$scope', '$location', '$window', 'gamename', function ($scope, $location, $window, gamename) {
        $scope.$root.title = gamename+' | About';
    }])

    // Path: /login
    .controller('LoginCtrl', ['$scope', '$location', '$window', 'UserService', 'gamename', function ($scope, $location, $window, UserService, gamename) {
        $scope.$root.title = gamename+' | Sign In';
        $scope.user = {};
        $scope.isLoggedIn = false;
        $scope.authError = '';
        $scope.result = {};
        $scope.bAuthError = false;

        $scope.reset = function (email) {
            UserService.reset(email).then(function (data) {
                $scope.result = angular.fromJson(data.data);
            }, function (error) {
                $scope.result = { msg: 'Sorry, an error occured.', success: false };
            });
        };

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
    .controller('UserCtrl', ['$scope', '$location', '$window', 'UserService', 'NotificationService', 'AccountService', 'gamename', function ($scope, $location, $window, UserService, NotificationService, AccountService, gamename) {
        $scope.$root.title = gamename+' | ' + UserService.user.FullName;
        $scope.username = '';
        $scope.isLoggedIn = false;
        $scope.userImageUrl = '';
        $scope.user = {};
        $scope.acheivements = {};
        $scope.registerText = 'Register To Get Email';
        $scope.registerSuccess = false;
        $scope.registerClicked = false;

        $scope.registerToGetEmail = function () {
            AccountService.registerForUpdates($scope.user.Id)
            .then(function (data) {
                $scope.registerText = angular.fromJson(data.data).msg;
                $scope.registerSuccess = true;
            }, function (error) {
                $scope.registerText = 'Unfortunately, we could not register you to get updates :(';
                $scope.registerSuccess = false;
            });
            $scope.registerClicked = true;
        };

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

    .controller('AccountCtrl', ['$scope', '$routeParams', '$window', 'AccountService', function ($scope, $routeParams, $window, AccountService) {
        $scope.$root.title = 'External Portal';
        $scope.result = {}

        $scope.$on('$viewContentLoaded', function () {
            AccountService.doNotDisturb($routeParams.hash)
            .then(function (data) {
                $scope.result = angular.fromJson(data.data);
            }, function (error) {
                $scope.result = { msg: 'Action not successful. I\'m Sorry', success: false };
            });
        });
    }])

    .controller('RegisterCtrl', ['$scope', '$routeParams', '$window', 'AccountService', function ($scope, $routeParams, $window, AccountService) {
        $scope.$root.title = 'External Portal';
        $scope.result = {}

        $scope.$on('$viewContentLoaded', function () {
            AccountService.confirmEmail($routeParams.hash, $routeParams.confirmationCode)
            .then(function (data) {
                $scope.result = angular.fromJson(data.data);
            }, function (error) {
                $scope.result = { msg: 'Registration not successful, please contact support. I\'m Sorry', success: false };
            });
        });
    }])

    // Path: /error/404
    .controller('Error404Ctrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Error 404: Page Not Found';
    }]);