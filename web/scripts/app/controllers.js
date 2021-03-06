﻿"use strict";

angular
  .module("app.controllers", ["app.services"])

  // Path: /
  .controller("CommandCtrl", [
    "$scope",
    "$location",
    "UserService",
    "CommandService",
    "$filter",
    "gamename",
    function(
      $scope,
      $location,
      UserService,
      CommandService,
      $filter,
      gamename,
    ) {
      $scope.$root.title = gamename;
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
              $scope.user = data;
              $scope.navigation = $scope.user.navigation;
            },
            function(_error) {
              $location.path("/login");
            }
          );
        }
      }

      activate();

      $scope.viewTab = "potions";
      $scope.mainTab = "bag";

      $scope.messages = [];
      $scope.oldMessages = [];
      $scope.olderMessages = [];
      $scope.oldestMessages = [];

      $scope.submit = function(data) {
        CommandService.submit(data, $scope.user.Id).then(
          function(data) {
            var d = data;
            $scope.oldestMessages = $scope.olderMessages;
            $scope.olderMessages = $scope.oldMessages;
            $scope.oldMessages = $scope.messages;
            $scope.messages = [];
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
            var d = data;
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

      $scope.changeTab = function(tabName) {
        $scope.viewTab = tabName;
      }

      $scope.reverse = function(arr) {
        return angular.copy(arr).reverse();
      };

      $scope.togglemenu = function(focus) {
        $scope.showmenu = !$scope.showmenu;
        if (focus) {
          if (focus === 'shop') {
            $scope.mainTab = 1;
            $scope.getBuyList();
          } else {
            $scope.mainTab = 0;
          }
        }
      };
    }
  ])

  .controller("HomeCtrl", [
    "$scope",
    "gamename",
    function(
      $scope,
      gamename,
    ) {
      $scope.$root.title = gamename;
      $scope.items = {};
      $scope.acheivements = {};
    }
  ])

  // Path: /login
  .controller("LoginCtrl", [
    "$scope",
    "$location",
    "UserService",
    "gamename",
    function($scope, $location, UserService, gamename) {
      $scope.$root.title = gamename;
      $scope.authError = "";
      $scope.result = {};
      $scope.bAuthError = false;
      $scope.bResetError = false;
      $scope.pleasewait = "";

      function activate() {
        if (UserService.isLoggedIn()) {
          $location.path("/play");
        }
      }

      activate();

      $scope.error = {};
      $scope.hasError = false;
      $scope.registered = false;
      $scope.notification = "";
      $scope.hasClicked = false;
      $scope.emailOptout = false;

      $scope.signup = function(
        username,
      ) {
        $scope.pleasewait = "Registering. Please wait.";
        $scope.hasClicked = true;
        $scope.registered = false;
        UserService.register(
          username,
        ).then(
          function() {
            $scope.error = {};
            $scope.hasError = false;
            $scope.registered = true;
            $scope.hasClicked = false;
            $scope.userName = "";
            $location.path("/play");
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


  // Path: /error/404
  .controller("Error404Ctrl", [
    "$scope",
    function($scope) {
      $scope.$root.title = "Page Not Found";
    }
  ]);
