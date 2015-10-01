(function () {
    'use strict';

    angular
        .module('app')
        .service('editService', editService);

    editService.$inject = ['$http'];

    function editService($http) {
        this.zeroGUID = '00000000-0000-0000-0000-000000000000';

        this.monster = {
            id: 0,
            title: 'Monsters'
        };

        this.area = {
            id: 1,
            title: 'Areas'
        };

        this.location = {
            id: 2,
            title: 'Locations'
        };

        this.room = {
            id: 3,
            title: 'Rooms'
        };

        this.relic = {
            id: 4,
            title: 'Relics'
        };

        this.questgiver = {
            id: 5,
            title: 'Quest Givers'
        };

        this.quest = {
            id: 6,
            title: 'Quests'
        };

        this.event = {
            id: 7,
            title: 'Events'
        };

        this.contexts = [this.monster, this.area, this.location, this.room, this.relic, this.questgiver, this.quest, this.event];


        this.getMonsters = function () {
            return $http.get('/quest/GetMonsters');
        }

        this.getRelics = function () {
            return $http.get('/quest/GetRelics');
        }

        this.getAreas = function () {
            return $http.get('/quest/GetAreas');
        }

        this.getLocations = function () {
            return $http.get('/quest/GetLocations');
        }

        this.getRooms = function () {
            return $http.get('/quest/GetRooms');
        }

        this.getQuestGivers = function () {
            return $http.get('/quest/GetQuestGivers');
        }

        this.getQuests = function () {
            return $http.get('/quest/GetQuests');
        }

        this.deleteQuest = function (id) {
            return $http.delete('/quest/DeleteQuest/' + id);
        }

        this.deleteQuestGiver = function (id) {
            return $http.delete('/quest/DeleteQuestGiver/' + id);
        }

        this.createQuest = function (model) {
            return $http.put('/quest/CreateQuest', model);
        }

        this.createQuestGiver = function (model) {
            return $http.put('/quest/CreateQuestGiver', model);
        }

        this.update = function (model) {
            var ids = [];
            if (model.QuestsToUnlockThisQuestGiver != null) {
                angular.forEach(model.QuestsToUnlockThisQuestGiver, function (quest) {
                    ids.push(quest.Id);
                });
            }
            return $http.post('/quest/UpdateQuestGiver/' + model.Id, {
                Name: model.Name,
                Description: model.Description,
                QuestId: model.Quest.Id,
                QuestIdsToComplete: ids
            });
        }
    }
})();