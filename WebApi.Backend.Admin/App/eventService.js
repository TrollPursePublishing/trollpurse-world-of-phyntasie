(function () {
    'use strict';

    angular
        .module('app')
        .service('eventService', eventService);

    eventService.$inject = ['$http'];

    function eventService($http) {
        this.defaultEvent = function () {
            return {
                Title: '',
                Description: ''
            }
        }

        this.create = function (model) {
            return $http.put('/event/CreateEvent', model);
        }

        this.get = function () {
            return $http.get('/event/GetEvents');
        }
    }
})();