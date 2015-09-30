'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.

var getAsync = function (url, $q, $http) {
    var q = $q.defer();
    $http.get(url)
    .success(function (data) {
        q.resolve({ data: data });
    })
    .error(function (msg, code) {
        if (code == 401) {
            localStorage.removeItem('aqg_token');
        }
        q.reject(msg);
    });
    return q.promise;
};

var getAsyncData = function (url, data, $q, $http) {
    var q = $q.defer();
    $http.get(url, data)
    .success(function (data) {
        q.resolve({ data: data });
    })
    .error(function (msg, code) {
        if (code == 401) {
            localStorage.removeItem('aqg_token');
        }
        q.reject(msg);
    });
    return q.promise;
};

var postAsync = function (url, data, $q, $http) {
    var q = $q.defer();
    $http.post(url, data)
    .success(function (data) {
        q.resolve({ data: data });
    })
    .error(function (msg, code) {
        if (code == 401) {
            localStorage.removeItem('aqg_token');
        }
        q.reject(msg);
    });
    return q.promise;
};

angular.module('app.services', [])


    .factory('CommandService', ['$http', '$q', function ($http, $q) {
        var command = {};
        command.submit = function (data, userId) {
            //console.log(data);
            var q = $q.defer();
            $http.post('api/Command', {playerId: userId, parameters: data})
            .success(function (data) {
                q.resolve({ data: data });
            })
            .error(function (msg, code) {
                q.reject(msg);
            });
            return q.promise;
        };

        return command;
    }])

    .factory('MessageService', ['$http', '$q', '$rootScope', '$', function ($http, $q, $rootScope, $) {
        var message = {};
        message.ChatHub = {};
        message.chatConnected = false;
        var proxy = null;


        message.startupServices = function () {
            $(function () {
                $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
                console.log('Enabling tooltips.');
            });
            var q = $q.defer();
            if (!message.chatConnected) {
                $(function () {
                    message.ChatHub = $.connection.chatHub;
                    message.ChatHub.client.broadcastMessage = function (playerName, msg) {
                        console.log('broadcast', playerName + ':' + msg);
                        $rootScope.$emit('chat', { name: playerName, msg: msg });
                    }

                    message.ChatHub.client.broadcastJoin = function (playerName) {
                        console.log('broadcast', playerName + ':' + 'join');
                        $rootScope.$emit('playerjoin', { name: playerName });
                    }
                    $.connection.hub.start()
                    .done(function () { message.chatConnected = true; console.log('signalR', 'Connected!'); q.resolve('success'); })
                    .fail(function () { message.chatConnected = false; console.log('signalR', 'Not Connected :('); q.reject('failure') });
                });
            }
            return q.promise;
        };

        message.send = function (playerName, msg, locationId) {
            message.ChatHub.server.send(playerName, msg, locationId);
        };

        message.joinLocation = function (locationId, playerName) {
            message.ChatHub.server.joinLocation(locationId, playerName);
        };

        message.leaveLocation = function (locationId) {
            message.ChatHub.server.leaveLocation(locationId);
        };

        return message;

    }])

    .factory('NotificationService', ['$http', '$q', function ($http, $q) {
        var notifications = {};

        notifications.getEvents = function () {
            return getAsync('api/message/events', $q, $http);
        };

        notifications.getPlayerAcheivements = function (userId) {
            return getAsync('api/ach/' + userId, $q, $http);
        };

        notifications.getAllPlayerAchievements = function () {
            return getAsync('api/ach/latest', $q, $http);
        };

        return notifications;
    }])

    .factory('RanksService', ['$http', '$q', function ($http, $q) {
        var ranks = {};

        //TODO: http get call
        ranks.get = function () {
            return getAsync('api/ranks/topten', $q, $http);
        };

        ranks.getById = function (userId) {
            return getAsync('api/ranks/' + userId, $q, $http);
        };

        ranks.getAll = function () {
            return getAsync('api/ranks/all', $q, $http);
        };

        return ranks;
    }])

    .factory('AccountService', ['$http', '$q', function ($http, $q) {
        var acc = {};

        acc.confirmEmail = function (hash, confirmationCode) {
            return getAsync('api/account/confirm/' + hash + '/' + confirmationCode, $q, $http);
        };

        acc.doNotDisturb = function (hash) {
            return getAsync('api/account/donotdisturb/' + hash, $q, $http);
        };

        acc.registerForUpdates = function (playerId) {
            return postAsync('api/account/sendmail', {playerId: playerId}, $q, $http);
        };

        acc.resetPassword = function (id, password, confirmPassword) {
            return postAsync('api/account/password/confirm', { id: id, password: password, confirmPassword: confirmPassword }, $q, $http);
        };

        acc.resetConfirm = function (hash, securityStamp) {
            return getAsync('api/account/password/' + hash + '/' + securityStamp, $q, $http);
        };

        acc.getSendMail = function (playerId) {
            return getAsync('api/account/sendmail/' + playerId, $q, $http);
        };

        return acc;
    }])

    .factory('UserService', ['$http', '$q', function ($http, $q) {
        var user = {};
        user.user;

        user.clearToken = function () {
            localStorage.removeItem('aqg_token');
        }

        user.isLoggedIn = function () {
            var token = angular.fromJson(localStorage['aqg_token']);
            var valid = token != undefined;
            if (valid) {
                valid = moment(token['.expires']).isAfter(new Date());
            }
            return valid;
        }

        user.getId = function () {
            return angular.fromJson(localStorage['aqg_token']).id;
        }

        user.getUserData = function () {
            return getAsync('api/player/' + user.getId(), $q, $http);
        };

        user.login = function (enteredusername, password) {
            return $http.post(
                '/token',
                $.param({ grant_type: 'password', username: enteredusername, password: password }),
                {
                    headers:
                      {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                      }
                }
            );
        };

        user.logout = function () {
            return postAsync('api/account/logout', { playerId: user.getId() }, $q, $http);
        };

        user.register = function (username, password, confirmpassword, email, gender, noemail) {
            var data = { username: username, password: password, confirmpassword: confirmpassword, email: email, gender: gender, emailOptout: noemail };
            return postAsync('api/account/register', data, $q, $http);
        };

        user.getPlayerData = function () {
            return getAsync('api/player/' + user.getId(), $q, $http);
        };

        user.reset = function (email) {
            return postAsync('api/account/password/reset', '"'+email+'"', $q, $http);
        };

        user.onLoginSuccess = function () {
            $http.defaults.headers.common.Authorization = 'Bearer ' + angular.fromJson(localStorage.getItem('aqg_token')).access_token;
        };

        return user;
    }])

    .value('version', '0.0.7.0')
    .value('gamename', 'AdventureQuestGame')
