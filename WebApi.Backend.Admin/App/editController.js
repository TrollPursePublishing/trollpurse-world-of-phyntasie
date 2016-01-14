(function () {
    'use strict';

    angular
        .module('app')
        .controller('editController', editController);

    editController.$inject = ['$scope', 'editService', 'authService', 'locationService', 'eventService', 'monsterService',
    'relicService'];

    function editController($scope, editService, authService, locationService, eventService, monsterService,
        relicService) {
        $scope.title = 'editController';

        $scope.error = '';

        $scope.context = {
            id: -1,
            title: 'Choose a Category to Edit'
        };

        $scope.monster = editService.monster;
        $scope.area = editService.area;
        $scope.location = editService.location;
        $scope.room = editService.room;
        $scope.relic = editService.relic;
        $scope.questgiver = editService.questgiver;
        $scope.quest = editService.quest;
        $scope.event = editService.event;

        $scope.working = editService.zeroGUID;

        function loadLocations() {
            locationService.get().then(function (good) {
                $scope.locations = angular.fromJson(good.data);
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        function loadAreas() {
            editService.getAreas().then(function (good) {
                $scope.areas = angular.fromJson(good.data);
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        function loadRooms() {
            editService.getRooms().then(function (good) {
                $scope.rooms = angular.fromJson(good.data);
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        function loadMonsters() {
            monsterService.get().then(function (good) {
                $scope.monsters = angular.fromJson(good.data);
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        function loadRelics() {
            relicService.get().then(function (good) {
                $scope.relics = angular.fromJson(good.data);
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        function loadQuests() {
            editService.getQuests().then(function (good) {
                $scope.quests = angular.fromJson(good.data);
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        function loadEvents() {
            eventService.get().then(function (good) {
                $scope.events = angular.fromJson(good).data;
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        function loadQuestGivers() {
            $scope.working = editService.zeroGUID;
            editService.getQuestGivers().then(function (good) {
                $scope.questGivers = angular.fromJson(good).data;
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.logout = function () {
            authService.logout();
        }

        $scope.ch_context = function (id) {
            $scope.context = editService.contexts[id];
            $scope.error = '';
            switch ($scope.context.id) {
                case editService.monster.id:
                    $scope.resetMonster();
                    loadMonsters();
                    break;
                case editService.area.id:
                    loadAreas();
                    break;
                case editService.location.id:
                    $scope.resetLocation();
                    loadRooms();
                    loadQuestGivers();
                    loadLocations();
                    break;
                case editService.room.id:
                    loadRooms();
                    break;
                case editService.relic.id:
                    $scope.resetRelic();
                    loadRelics();
                    break;
                case editService.questgiver.id:
                    $scope.resetGiver();
                    loadQuests();
                    loadQuestGivers();
                    break;
                case editService.quest.id:
                    $scope.resetQuest();
                    loadQuests();
                    loadMonsters();
                    $scope.$watch('currentQuest.QuestType', function (newValue, oldValue) {
                        if (newValue != oldValue) {
                            $scope.relics = undefined;
                            $scope.areas = undefined;
                            $scope.locations = undefined;
                            $scope.rooms = undefined;
                            $scope.monsters = undefined;
                            $scope.currentQuest.NameOfObject = 'None';

                            switch (newValue) {
                                case '0':
                                    loadMonsters();
                                    break;
                                case '1':
                                    loadRelics();
                                    break;
                                case '2':
                                    loadRooms();
                                    loadLocations();
                                    loadAreas();
                                    break;
                                default:
                                    console.error('Bad QuestType', newValue);
                                    break;
                            }
                        }
                    });
                    break;
                case editService.event.id:
                    $scope.resetEvent();
                    loadEvents();
                    break;
                default:
                    console.error('Invalid context', $scope.context);
                    break;
            }
        };

        $scope.monsters;
        $scope.relics;
        $scope.areas;
        $scope.locations;
        $scope.rooms;
        $scope.questGivers;
        $scope.quests;
        $scope.events;

        var defaultQuest = {
            Title: '',
            Description: '',
            Instructions: '',
            GoldReward: 0,
            ScoreReward: 0,
            ExperienceReward: 0,
            QuestType: '0',
            NameOfObject: 'None',
            CountNeeded: 0,
            NextQuestId: editService.zeroGUID
        };

        var defaultGiver = {
            Name: '',
            Description: '',
            QuestId: editService.zeroGUID,
            QuestIdsToComplete: []
        };

        $scope.currentQuest;
        $scope.currentQuestGiver;
        $scope.currentLocation;
        $scope.currentEvent;
        $scope.currentMonster;
        $scope.currentRelic;

        $scope.resetRelic = function() {
            $scope.working = editService.zeroGUID;
            $scope.currentRelic = relicService.defaultRelic();
        }

        $scope.resetQuest = function () {
            $scope.working = editService.zeroGUID;
            $scope.currentQuest = angular.copy(defaultQuest);
        }

        $scope.resetGiver = function () {
            $scope.working = editService.zeroGUID;
            $scope.currentQuestGiver = angular.copy(defaultGiver);
        }

        $scope.resetLocation = function () {
            $scope.working = editService.zeroGUID;
            $scope.currentLocation = locationService.defaultLocation();
        }

        $scope.resetEvent = function () {
            $scope.working = editService.zeroGUID;
            $scope.currentEvent = eventService.defaultEvent();
        }

        $scope.resetMonster = function () {
            $scope.working = editService.zeroGUID;
            $scope.currentMonster = monsterService.defaultMonster();
        }

        activate();

        function activate() {
        }

        $scope.deleteRelic = function (id) {
            $scope.error = '';
            relicService.delete(id).then(function (good) {
                loadRelics();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.deleteQuest = function(id) {
            $scope.error = '';
            editService.deleteQuest(id).then(function(data){
                loadQuests();
            }, function(bad){
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.deleteQuestGiver = function (id) {
            $scope.error = '';
            editService.deleteQuestGiver(id).then(function (good) {
                loadQuestGivers();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.deleteLocation = function (id) {
            $scope.error = '';
            locationService.delete(id).then(function (good) {
                loadLocations();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.deleteMonster = function (id) {
            $scope.error = '';
            monsterService.delete(id).then(function (good) {
                loadMonsters();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.createEvent = function () {
            $scope.error = '';
            eventService.create($scope.currentEvent).then(function (good) {
                loadEvents();
                $scope.resetEvent();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.createQuest = function () {
            $scope.error = '';
            editService.createQuest($scope.currentQuest).then(function (good) {
                loadQuests();
                $scope.resetQuest();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.createQuestGiver = function () {
            $scope.error = '';
            editService.createQuestGiver($scope.currentQuestGiver).then(function (good) {
                loadQuestGivers();
                $scope.resetGiver();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.createLocation = function () {
            $scope.error = '';
            locationService.create($scope.currentLocation).then(function (good) {
                loadLocations();
                $scope.resetLocation();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.createMonster = function () {
            $scope.error = '';
            monsterService.create($scope.currentMonster).then(function (good) {
                loadMonsters();
                $scope.resetMonster();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.createRelic = function () {
            $scope.error = '';
            relicService.create($scope.currentRelic).then(function (good) {
                loadRelics();
                $scope.resetRelic();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.updateLocationRoom = function (id, location) {
            if (!angular.isDefined(location.rooms)) {
                location.rooms = [];
            }
            angular.forEach($scope.rooms, function (room) {
                if (room.Id == id) {
                    location.rooms.push(room);
                }
            });
        }

        $scope.updateLocationQuestGiver = function (id, location) {
            if (id == editService.zeroGUID) {
                location.QuestGiver = null;
            } else {
                angular.forEach($scope.questGivers, function (questGiver) {
                    if (questGiver.Id == id) {
                        location.QuestGiver = questGiver;
                    }
                });
            }
        }

        $scope.removeLocationRoom = function (id, location) {
            angular.forEach(location.rooms, function (room) {
                if (room.Id == id) {
                    location.rooms.splice(room, 1);
                }
            });
        }

        $scope.updateRelic = function (relic) {
            $scope.error = '';
            relicService.update(relic.Id, relic).then(function (good) {
                loadRelics();
                $scope.resetRelic();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.updateLocation = function (location) {
            $scope.error = '';
            locationService.update(location).then(function (good) {
                loadLocations();
                $scope.resetLocation();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.updateQuestGiver = function (questGiver) {
            $scope.error = '';
            editService.update(questGiver).then(function (good) {
                loadQuestGivers();
                $scope.resetGiver();
            }, function(bad){
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.updateMonster = function (monster) {
            $scope.error = '';
            monsterService.update(monster).then(function (good) {
                loadMonsters();
                $scope.resetMonster();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.updateQuestGiverQuest = function (id, questGiver) {
            if (id == editService.zeroGUID) {
                questGiver.Quest = null;
            } else {
                angular.forEach($scope.quests, function (quest) {
                    if (quest.Id == id) {
                        questGiver.Quest = quest;
                    }
                });
            }
        }

        $scope.removeQuestGiverRequiredQuest = function (id, questGiver) {
            angular.forEach(questGiver.QuestsToUnlockThisQuestGiver, function (quest) {
                if (quest.Id == id) {
                    questGiver.QuestsToUnlockThisQuestGiver.splice(quest, 1);
                }
            });
        }

        $scope.updateQuestGiverRequiredQuest = function (id, questGiver) {
            angular.forEach($scope.quests, function (quest) {
                if (quest.Id == id) {
                    questGiver.QuestsToUnlockThisQuestGiver.push(quest);
                }
            });
        }
    }
})();