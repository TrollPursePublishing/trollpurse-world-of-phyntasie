"use strict";

angular
  .module("app.services", [])
  .factory("CommandService", [
    "$q",
    function($q) {
      var command = {};
      command.submit = function(d) {
        var q = $q.defer();
        q.resolve({ data: doCommand(d) });
        return q.promise;
      };

      command.buylist = function(userId) {
        var q = $q.defer();
        q.resolve({ data: getBuyList() });
        return q.promise;
      };

      return command;
    }
  ])
  .factory("NotificationService", [
    "$q",
    function($q) {
      var notifications = {};

      notifications.getEvents = function() {
        var q = $q.defer();
        q.resolve({ data: [] });
        return q.promise;
      };

      notifications.getPlayerAcheivements = function(userId) {
        var q = $q.defer();
        q.resolve({ data: [] });
        return q.promise;
      };

      return notifications;
    }
  ])

  .factory("UserService", [
    "$http",
    "$q",
    function($http, $q) {
      var user = {};
      user.user;

      user.clearToken = function() {
        localStorage.removeItem("aqg_token");
      };

      user.isLoggedIn = function() {
        return (
          localStorage.getItem("autosave:Player") !== null &&
          localStorage.getItem("autosave:Player") !== undefined
        );
      };

      user.getId = function() {
        return "autosave:Player";
      };

      user.register = function(
        username,
      ) {
        localStorage.setItem(
          "autosave:Player",
          player({
            name: username,
            title: "Adventurer"
          })
        );
        var q = $q.defer();
        q.resolve({
          data: JSON.parse(localStorage.getItem("autosave:Player"))
        });
        return q.promise;
      };

      user.getPlayerData = function() {
        var q = $q.defer();
        q.resolve({
          data: JSON.parse(localStorage.getItem("autosave:Player"))
        });
        return q.promise;
      };

      return user;
    }
  ])

  .value("version", "1.0.0")
  .value("gamename", "World of Phyntasie");
