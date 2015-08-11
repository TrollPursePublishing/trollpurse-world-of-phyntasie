'use strict';

angular.module('app.directives', [])

    .directive('gameview', [function () {
        return {
            scope: true,
            restrict: 'EA',
            replace: true,
            template: '<div id="gamebody" style="overflow-y:auto;height:80%;max-height:80%;position:fixed;width:50%;max-width:50%;z-index:40000">' +
                          '<p ng-repeat="message in messages track by $index">{{message}}</p>' +
                      '</div>',
            link: function (scope, element, attrs, controller) {
                scope.$watch('messages', function (messages) {
                    element[0].scrollTop = element[0].scrollHeight;
                }, true);
            }
        }
    }])

    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('gameName', ['gamename', function (gamename) {
        return function (scope, elm, attrs) {
            elm.text(gamename);
        };
    }]);