'use strict';

angular.module('app.directives', [])

    .directive('scrollBotton', [])

    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);