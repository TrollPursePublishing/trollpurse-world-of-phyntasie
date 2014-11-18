'use strict';

angular.module('app.directives', [])

    .directive('gameview', [function () {
        return {
            scope: true,
            restrict: 'EA',
            replace: true,
            template: '<div id="gamebody" class="panel-body" style="overflow:auto; max-height: 400px; min-height:400px">' +
                        '<div ng-repeat="message in messages track by $index">' +
                            '<p>{{message}}</p>' +
                        '</div>' +
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
    }]);