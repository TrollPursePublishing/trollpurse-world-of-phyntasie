"use strict";

angular
  .module("app.controllers", ["app.services"])

  // Path: /
  .controller("CommandCtrl", [
    "$scope",
    "$location",
    "$window",
    "UserService",
    "CommandService",
    "$filter",
    function(
      $scope,
      $location,
      _$window,
      UserService,
      CommandService,
      $filter
    ) {
      $scope.user;
      $scope.currentDescription = {};
      $scope.navigation = {};
      $scope.chattext = [];
      $scope.chatlist = {};
      $scope.buylist = [];
      $scope.showmenu = true;

      function activate() {
        if (!UserService.isLoggedIn()) {
          $location.path("/login");
        } else {
          UserService.getPlayerData().then(
            function(data) {
              $scope.user = angular.fromJson(data.data);
              $scope.navigation = $scope.user.navigation;
            },
            function(_error) {
              $location.path("/login");
            }
          );
        }
      }

      activate();

      $scope.messages = [];

      $scope.$parent.$on("chat", function(event, data) {
        console.log("chat", data.name + ":" + data.msg);
        $scope.$apply(function() {
          $scope.chattext.push(data.name + " said, " + data.msg);
          $scope.chatlist[data.name] = 0;
        });
      });

      $scope.$parent.$on("playerjoin", function(event, data) {
        $scope.$apply(function() {
          if (data.name != $scope.user.FullName) {
            $scope.chattext.push(data.name + " has entered.");
            $scope.chatlist[data.name] = 0;
          }
        });
      });

      $scope.$parent.$on("playerleave", function(event, data) {
        $scope.$apply(function() {
          if (data.name != $scope.user.FullName) {
            $scope.chattext.push(data.name + " has left.");
            delete $scope.chatlist[data.name];
          }
        });
      });

      $scope.submit = function(data) {
        CommandService.submit(data, $scope.user.Id).then(
          function(data) {
            var d = angular.fromJson(data.data);
            if (
              $location.path().indexOf("play") > -1 &&
              d.messages != undefined
            ) {
              d.messages.reverse();
            }
            for (var i = 0; i < d.messages.length; i++) {
              $scope.messages.push(d.messages[i]);
            }
            $scope.user = d.player;
          },
          function(error) {
            console.error("error", error);
          }
        );
      };

      $scope.getBuyList = function() {
        CommandService.buylist($scope.user.Id).then(
          function(data) {
            var d = angular.fromJson(data.data);
            $scope.buylist = [];
            angular.forEach(d.messages, function(value) {
              $scope.buylist.push(value.split("&"));
            });
          },
          function(error) {
            console.error("error", error);
          }
        );
      };

      $scope.detailedView = function(descriptableObject) {
        delete descriptableObject.Id;
        $scope.currentDescription = descriptableObject;
        angular.forEach(descriptableObject, function(value, key) {
          if (key.indexOf("$") < 0) {
            $scope.messages.push($filter("property")(key) + ":   " + value);
          }
        });
      };

      //new stuff only
      $scope.propertyList = function(item) {
        var result = [];
        delete item.Id;
        angular.forEach(item, function(value, key) {
          if (key.indexOf("$") < 0) {
            result.push($filter("property")(key) + ":   " + value);
          }
        });
        return result;
      };

      $scope.do = function(cmd, what) {
        $scope.submit(cmd + " " + what);
      };

      $scope.reverse = function(arr) {
        return angular.copy(arr).reverse();
      };

      $scope.togglemenu = function() {
        $scope.showmenu = !$scope.showmenu;
      };

      $scope.chat = function(msg) {
        $scope.submit('"' + msg + '"');
      };

      $scope.temphcodeareas = [
        "Haunted Forest",
        "Vast Desert",
        "Buttleberry",
        "Reedton",
        "The Barren Wastes"
      ];
    }
  ])

  .controller("HomeCtrl", [
    "$scope",
    "$location",
    "$window",
    "NotificationService",
    "gamename",
    function(
      $scope,
      $location,
      $window,
      NotificationService,
      gamename
    ) {
      $scope.$root.title = gamename;
      $scope.items = {};
      $scope.events = {};
      $scope.acheivements = {};

      function activate() {
        NotificationService.getEvents().then(
          function(data) {
            $scope.events = angular.fromJson(data.data).events;
          },
          function(error) {
            console.error("error", error);
          }
        );
      }

      activate();
    }
  ])

  .controller("SignUpCtrl", [
    "$scope",
    "$location",
    "$window",
    "UserService",
    "gamename",
    function($scope, $location, $window, UserService, gamename) {}
  ])

  // Path: /about
  .controller("AboutCtrl", [
    "$scope",
    "$location",
    "$window",
    "gamename",
    function($scope, $location, $window, gamename) {
      $scope.$root.title = gamename + " | About";
    }
  ])

  // Path: /login
  .controller("LoginCtrl", [
    "$scope",
    "$location",
    "$window",
    "UserService",
    "gamename",
    function($scope, $location, $window, UserService, gamename) {
      $scope.$root.title = gamename + " | Login";
      $scope.authError = "";
      $scope.result = {};
      $scope.bAuthError = false;
      $scope.bResetError = false;
      $scope.pleasewait = "";

      function activate() {
        if (UserService.isLoggedIn()) {
          $location.path("/userwelcome");
        }
      }

      activate();

      $scope.reset = function(email) {
        $scope.pleasewait = "Sending reset. Please wait.";
        $scope.hasClicked = true;
        UserService.reset(email).then(
          function(data) {
            $scope.bResetError = false;
            $scope.result = angular.fromJson(data.data);
            $scope.hasClicked = false;
          },
          function(error) {
            $scope.bResetError = true;
            $scope.result = {
              msg: angular.isDefined(error.Message)
                ? error.Message
                : "Sorry, an error occured. Please contact support",
              success: false
            };
            $scope.hasClicked = false;
          }
        );
      };

      $scope.login = function(entereduserName, password) {
        $scope.pleasewait = "Logging in. Please wait.";
        $scope.hasClicked = true;
        UserService.login(entereduserName, password).then(
          function(data) {
            $scope.bAuthError = false;
            $scope.authError = "";
            var tk = angular.fromJson(data.data);
            localStorage.setItem("aqg_token", angular.toJson(data.data));
            UserService.onLoginSuccess();
            $scope.hasClicked = false;
            $location.path("/userwelcome");
          },
          function(error) {
            $scope.authError =
              error.data.error === "invalid_grant"
                ? "Incorrect username or password"
                : error.data.error;
            $scope.bAuthError = true;
            $scope.hasClicked = false;
          }
        );
      };

      $scope.error = {};
      $scope.hasError = false;
      $scope.registered = false;
      $scope.notification = "";
      $scope.hasClicked = false;
      $scope.emailOptout = false;

      $scope.signup = function(
        username,
        password,
        confirmpassword,
        email,
        gender,
        emailOptout
      ) {
        $scope.pleasewait = "Registering. Please wait.";
        $scope.hasClicked = true;
        $scope.registered = false;
        UserService.register(
          username,
          password,
          confirmpassword,
          email,
          gender,
          emailOptout
        ).then(
          function(data) {
            $scope.error = {};
            $scope.hasError = false;
            $scope.registered = true;

            if (emailOptout) $scope.notification = data.data.msg;
            else $scope.notification = data.data.Errors[0];

            $scope.hasClicked = false;

            $scope.userName = "";
            $scope.spassword = "";
            $scope.confirmpassword = "";
            $scope.email = "";
            $scope.gender = "";
            $scope.emailOptout = false;
          },
          function(error) {
            $scope.hasError = true;
            var result = angular.fromJson(error);
            console.log(result);
            $scope.error = angular.fromJson(result.ModelState);
            $scope.hasClicked = false;
          }
        );
        return $scope.success;
      };
    }
  ])

  // Path: /userwelcome
  .controller("UserCtrl", [
    "$scope",
    "$location",
    "$window",
    "UserService",
    "NotificationService",
    "gamename",
    function(
      $scope,
      $location,
      $window,
      UserService,
      NotificationService,
      gamename
    ) {
      $scope.$root.title = gamename;
      $scope.user = {};
      $scope.acheivements = {};
      $scope.registerText = "Register To Get Email";
      $scope.registerSuccess = false;
      $scope.currentlySendMail = false;

      function activate() {
        if (!UserService.isLoggedIn()) {
          $location.path("/login");
        }

        UserService.getPlayerData().then(
          function(data) {
            $scope.user = angular.fromJson(data.data);
            NotificationService.getPlayerAcheivements($scope.user.Id).then(
              function(data) {
                $scope.acheivements = angular.fromJson(data.data);
              },
              function(error) {
                console.error("error", error);
              }
            );
          },
          function(error) {
            $location.path("/login");
          }
        );
      }

      activate();

      $scope.logout = function() {
        UserService.logout();
        UserService.clearToken();
        $location.path("/");
      };

      $scope.adventure = function() {
        $location.path("/adventure");
      };

      $scope.adventurenew = function() {
        $location.path("/play");
      };
    }
  ])

  // Path: /error/404
  .controller("Error404Ctrl", [
    "$scope",
    "$location",
    "$window",
    function($scope, $location, $window) {
      $scope.$root.title = "Page Not Found";
    }
  ]);
