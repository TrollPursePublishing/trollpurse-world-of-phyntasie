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
            var roomIds = [];
            if (model.rooms != null) {
                angular.forEach(model.rooms, function (room) {
                    roomIds.push(room.Id);
                });
            }
            return $http.post('location/UpdateLocation/' + model.Id, {
                Name: model.name,
                Description: model.description,
                MonsterType: model.monsterTypeHere,
                HasMarket: model.HasMarket,
                IsExit: model.isExit,
                QuestGiverId: model.QuestGiver == null ? '00000000-0000-0000-0000-000000000000' : model.QuestGiver.Id,
                RoomIds: roomIds
            });
        }

        this.get = function () {
            return $http.get('location/GetLocations');
        }
    }
})();