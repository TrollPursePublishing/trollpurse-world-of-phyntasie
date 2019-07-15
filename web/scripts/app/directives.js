'use strict';

angular.module('app.directives', [])

    .directive('appVersion', ['version', function (version) {
        return function (_scope, elm, _attrs) {
            elm.text(version);
        };
    }])

    .directive('gameName', ['gamename', function (gamename) {
        return function (_scope, elm, _attrs) {
            elm.text(gamename);
        };
    }]);