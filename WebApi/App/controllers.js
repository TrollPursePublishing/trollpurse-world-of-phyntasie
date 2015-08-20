'use strict';

angular.module('app.controllers', ['app.services'])

    // Path: /
    .controller('CommandCtrl', ['$scope', '$location', '$window', 'UserService', 'CommandService', 'MessageService', '$filter', function ($scope, $location, $window, UserService, CommandService, MessageService, $filter) {
        $scope.user;
        $scope.currentDescription = {};
        $scope.navigation = {};

        function activate() {
            if (!UserService.isLoggedIn()) {
                $location.path('/login');
            } else {
                UserService.getPlayerData().then(function (data) {
                    $scope.user = angular.fromJson(data.data);
                    $scope.navigation = $scope.user.navigation;
                    MessageService.startupServices().then(function () {
                        if (MessageService.chatConnected) {
                            $scope.$parent.$emit('chatready');
                        }
                    }, function (error) {
                        console.log('error', error);
                    });
                }, function (error) {
                    $location.path('/login');
                });
            }
        }

        activate();

        $scope.messages = [];

        $scope.$parent.$on('chat', function (event, data) {
            console.log('chat', data.name + ':' + data.msg);
            $scope.$apply(function () {
                $scope.messages.push(data.name + ' said, ' + data.msg);
            });
        });

        $scope.$parent.$on('playerjoin', function (event, data) {
            $scope.$apply(function () {
                if(data.name != $scope.user.FullName)
                {
                    $scope.messages.push(data.name + ' has entered.');
                }
            });
        });

        $scope.$parent.$on('chatready', function () {
            console.log('chatready', 'initialized');
            MessageService.joinLocation($scope.user.navigation.currentLocation.Id, $scope.user.FullName);
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
                    MessageService.joinLocation($scope.user.navigation.currentLocation.Id, $scope.user.FullName);
                }, function (error) {
                    console.error('error', error);
                    MessageService.joinLocation($scope.user.navigation.currentLocation.Id, $scope.user.FullName);
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
        $scope.errored = false;

        function activate() {
            AccountService.resetConfirm($routeParams.hash, $routeParams.securityStamp).then(function (data) {
                $scope.enterResult = angular.fromJson(data.data);
            }, function (error) {
                $scope.enterResult = { msg: 'Reset not successful, please contact support. I\'m Sorry', success: false };
            });
        }

        activate();

        $scope.resetPassword = function (password, confirmPassword) {
            $scope.showClick = true;
            $scope.errored = false;
            AccountService.resetPassword($scope.enterResult.additionalData, password, confirmPassword).then(function (data) {
                $scope.showClick = false;
                $scope.result = data.data;
                $scope.errored = !$scope.result.success;
            }, function (error) {
                $scope.showClick = false;
                $scope.errored = true;
                $scope.result = { msg: 'Reset not successful. Please contact support.', success: false, additionalData: $scope.enterResult.additionalData };
            });
        }
    }])

    .controller('HomeCtrl', ['$scope', '$location', '$window', 'RanksService', 'NotificationService', 'gamename', function ($scope, $location, $window, RankService, NotificationService, gamename) {
        $scope.$root.title = gamename;
        $scope.items = {};
        $scope.events = {};
        $scope.acheivements = {};

        function activate() {
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
        }

        activate();
    }])

    .controller('SignUpCtrl', ['$scope', '$location', '$window', 'UserService', 'gamename', function ($scope, $location, $window, UserService, gamename) {
        
    }])

    // Path: /ranks
    .controller('RanksCtrl', ['$scope', '$location', '$window', 'RanksService', 'UserService', '$filter', 'gamename', function ($scope, $location, $window, RanksService, UserService, $filter, gamename) {
        $scope.$root.title = gamename +' | Ranks';
        $scope.items = {};
        $scope.rankuser = {};
        $scope.rank = '';
        $scope.user = {};
        $scope.isLoggedIn = UserService.isLoggedIn;

        function activate() {
            RanksService.getAll()
            .then(function (data) {
                $scope.items = $filter('orderBy')(angular.fromJson(data.data).pairs, '-score');
                if (UserService.isLoggedIn()) {
                    UserService.getPlayerData().then(function (data) {
                        $scope.user = angular.fromJson(data.data);
                        RanksService.getById($scope.user.Id)
                        .then(function (data) {
                            $scope.rankuser = angular.fromJson(data.data);
                        });
                        for (var i = 0; i < $scope.items.length; ++i) {
                            if ($scope.items[i].name === $scope.user.FullName) {
                                $scope.rank = i + 1;
                                break;
                            }
                        }
                    });
                }
            });
        }

        activate();
    }])

    // Path: /about
    .controller('AboutCtrl', ['$scope', '$location', '$window', 'gamename', function ($scope, $location, $window, gamename) {
        $scope.$root.title = gamename+' | About';
    }])

    // Path: /login
    .controller('LoginCtrl', ['$scope', '$location', '$window', 'UserService', 'gamename', function ($scope, $location, $window, UserService, gamename) {
        $scope.$root.title = gamename+' | Login';
        $scope.authError = '';
        $scope.result = {};
        $scope.bAuthError = false;
        $scope.bResetError = false;
        $scope.pleasewait = '';

        function activate() {
            if (UserService.isLoggedIn()) {
                $location.path('/userwelcome');
            }
        }

        activate();

        $scope.reset = function (email) {
            $scope.pleasewait = 'Sending reset. Please wait.';
            $scope.hasClicked = true;
            UserService.reset(email).then(function (data) {
                $scope.bResetError = false;
                $scope.result = angular.fromJson(data.data);
                $scope.hasClicked = false;
            }, function (error) {
                $scope.bResetError = true;
                $scope.result = { msg: angular.isDefined(error.Message) ? error.Message : 'Sorry, an error occured. Please contact support', success: false };
                $scope.hasClicked = false;
            });
        };

        $scope.login = function (entereduserName, password) {
            $scope.pleasewait = 'Logging in. Please wait.';
            $scope.hasClicked = true;
            UserService.login(entereduserName, password).then(function (data) {
                $scope.bAuthError = false;
                $scope.authError = '';
                var tk = angular.fromJson(data.data);
                localStorage.setItem('aqg_token', angular.toJson(data.data));
                UserService.onLoginSuccess();
                $scope.hasClicked = false;
                $location.path('/userwelcome');
            }, function (error) {
                $scope.authError = error.data.error === 'invalid_grant' ? 'Incorrect username or password' : error.data.error;
                $scope.bAuthError = true;
                $scope.hasClicked = false;
            });
        };

        $scope.error = {};
        $scope.hasError = false;
        $scope.registered = false;
        $scope.notification = '';
        $scope.hasClicked = false;

        $scope.signup = function (username, password, confirmpassword, email, gender) {
            $scope.pleasewait = 'Registering. Please wait.';
            $scope.hasClicked = true;
            $scope.registered = false;
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
    }])

    // Path: /userwelcome
    .controller('UserCtrl', ['$scope', '$location', '$window', 'UserService', 'NotificationService', 'AccountService', 'gamename', function ($scope, $location, $window, UserService, NotificationService, AccountService, gamename) {
        $scope.$root.title = gamename;
        $scope.user = {};
        $scope.acheivements = {};
        $scope.registerText = 'Register To Get Email';
        $scope.registerSuccess = false;
        $scope.currentlySendMail = false;

        function activate() {
            if (!UserService.isLoggedIn()) {
                $location.path('/login')
            }

            UserService.getPlayerData().then(function (data) {
                $scope.user = angular.fromJson(data.data);
                NotificationService.getPlayerAcheivements($scope.user.Id).then(function (data) {
                    $scope.acheivements = angular.fromJson(data.data);
                }, function (error) {
                    console.error('error', error);
                });
                AccountService.getSendMail($scope.user.Id).then(function (data) {
                    $scope.currentlySendMail = true;
                }, function (error) {
                    console.error('error', error);
                });
            }, function (error) {
                if (error.code == 401)
                {
                    UserService.clearToken();
                }
                $location.path('/login');
            });
        }

        activate();

        $scope.registerToGetEmail = function () {
            if (!$scope.currentlySendMail) {
                AccountService.registerForUpdates($scope.user.Id)
                .then(function (data) {
                    $scope.registerText = angular.fromJson(data.data).msg;
                    $scope.registerSuccess = true;
                    $scope.currentlySendMail = true;
                }, function (error) {
                    $scope.registerText = 'Unfortunately, we could not register you to get updates :(';
                    $scope.registerSuccess = false;
                });
            }
        };

        $scope.logout = function () {
            UserService.logout()
            UserService.clearToken();
            $location.path('/');
        };

        $scope.adventure = function () {
            $location.path('/adventure');
        };
    }])

    .controller('AccountCtrl', ['$scope', '$routeParams', '$window', 'AccountService', function ($scope, $routeParams, $window, AccountService) {
        $scope.$root.title = 'External Portal';
        $scope.result = {}

        function activate() {
            AccountService.doNotDisturb($routeParams.hash)
            .then(function (data) {
                $scope.result = angular.fromJson(data.data);
            }, function (error) {
                $scope.result = { msg: 'Action not successful.', success: false };
            });
        }

        activate();
    }])

    .controller('RegisterCtrl', ['$scope', '$routeParams', '$window', 'AccountService', function ($scope, $routeParams, $window, AccountService) {
        $scope.$root.title = 'External Portal';
        $scope.result = {}

        function activate() {
            AccountService.confirmEmail($routeParams.hash, $routeParams.confirmationCode)
            .then(function (data) {
                $scope.result = angular.fromJson(data.data);
            }, function (error) {
                $scope.result = { msg: 'Registration not successful, please contact support.', success: false };
            });
        }

        activate();
    }])

    // Path: /error/404
    .controller('Error404Ctrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Page Not Found';
    }]);