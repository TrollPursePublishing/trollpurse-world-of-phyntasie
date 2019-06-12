"use strict";

const {
  doCommand,
  getPlayer,
  getBuyList,
  createPlayer,
} = wop_game();

angular
  .module("app.services", [])
  .factory("CommandService", [
    "$q",
    function($q) {
      var command = {};
      command.submit = function(d) {
        var q = $q.defer();
        q.resolve(JSON.parse(doCommand(d)));
        return q.promise;
      };

      command.buylist = function(userId) {
        var q = $q.defer();
        q.resolve(JSON.parse(getBuyList()));
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
        q.resolve([]);
        return q.promise;
      };

      notifications.getPlayerAcheivements = function(userId) {
        var q = $q.defer();
        q.resolve([]);
        return q.promise;
      };

      return notifications;
    }
  ])

  .factory("UserService", [
    "$q",
    function($q) {
      var user = {};
      user.user;

      user.clearToken = function() {
        localStorage.removeItem("aqg_token");
      };

      user.isLoggedIn = function() {
        return !!getPlayer();
      };

      user.getId = function() {
        return "autosave:Player";
      };

      user.register = function(
        username,
      ) {
        createPlayer(username);
        var q = $q.defer();
        q.resolve( JSON.parse(getPlayer("autosave")));
        return q.promise;
      };

      user.getPlayerData = function() {
        var q = $q.defer();
        q.resolve(JSON.parse(getPlayer("autosave")));
        return q.promise;
      };

      return user;
    }
  ])

  .value("version", "1.0.0")
  .value("gamename", "World of Phyntasie");
