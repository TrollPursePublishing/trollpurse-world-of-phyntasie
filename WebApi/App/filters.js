'use strict';

angular.module('app.filters', [])

    .filter('property', function () {
        return function (input) {
            var result = input.split(/(?=[A-Z])/);
            for (var i = 0; i < result.length; i++) {
                result[i] = result[i].charAt(0).toUpperCase() + result[i].slice(1);
            }
            return result.join(' ');
        };
    })

    .filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]);