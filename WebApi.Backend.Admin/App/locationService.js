(function () {
    'use strict';

    angular
        .module('app')
        .service('locationService', locationService);

    locationService.$inject = ['$http'];

    function locationService($http) {
        this.defaultLocation = function () {
            return {
                Name: '',
                Description: '',
                MonsterType: '0',
                HasMarket: false,
                IsExit: false,
                QuestGiverId: '00000000-0000-0000-0000-000000000000',
                RoomIds: []
            };
        }

        this.create = function (model) {
            return $http.put('location/CreateLocation', model);
        }

        this.delete = function (id) {
            return $http.delete('location/DeleteLocation/' + id);
        }

        this.update = function (model) {
            return $http.post('location/UpdateLocation/' + model.Id, model);
        }

        this.get = function () {
            return $http.get('location/GetLocations');
        }
    }
})();