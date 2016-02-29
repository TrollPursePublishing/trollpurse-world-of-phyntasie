(function () {
    'use strict';

    angular
        .module('app')
        .controller('editController', editController);

    editController.$inject = ['$scope', 'editService', 'authService', 'locationService', 'eventService', 'monsterService',
    'relicService', 'areaService'];

    function editController($scope, editService, authService, locationService, eventService, monsterService,
        relicService, areaService) {
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
            areaService.get().then(function (good) {
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
        $scope.currentArea;

        $scope.resetArea = function () {
            $scope.working = editService.zeroGUID;
            $scope.currentArea = areaService.defaultArea();
        }

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

        function onBad(bad) {
            var res = angular.fromJson(bad); $scope.error = bad.statusText;
        }

        $scope.deleteArea = function (id) {
            $scope.error = '';
            areaService.delete(id).then(function (data) {
                loadAreas();
            }, onBad);
        }

        $scope.deleteRelic = function (id) {
            $scope.error = '';
            relicService.delete(id).then(function (good) {
                loadRelics();
            }, onBad);
        }

        $scope.deleteQuest = function(id) {
            $scope.error = '';
            editService.deleteQuest(id).then(function(data){
                loadQuests();
            }, onBad);
        }

        $scope.deleteQuestGiver = function (id) {
            $scope.error = '';
            editService.deleteQuestGiver(id).then(function (good) {
                loadQuestGivers();
            },onBad);
        }

        $scope.deleteLocation = function (id) {
            $scope.error = '';
            locationService.delete(id).then(function (good) {
                loadLocations();
            },onBad);
        }

        $scope.deleteMonster = function (id) {
            $scope.error = '';
            monsterService.delete(id).then(function (good) {
                loadMonsters();
            },onBad);
        }

        $scope.createEvent = function () {
            $scope.error = '';
            eventService.create($scope.currentEvent).then(function (good) {
                loadEvents();
                $scope.resetEvent();
            }, onBad);
        }

        $scope.createQuest = function () {
            $scope.error = '';
            editService.createQuest($scope.currentQuest).then(function (good) {
                loadQuests();
                $scope.resetQuest();
            },onBad);
        }

        $scope.createQuestGiver = function () {
            $scope.error = '';
            editService.createQuestGiver($scope.currentQuestGiver).then(function (good) {
                loadQuestGivers();
                $scope.resetGiver();
            },onBad);
        }

        $scope.createLocation = function () {
            $scope.error = '';
            locationService.create($scope.currentLocation).then(function (good) {
                loadLocations();
                $scope.resetLocation();
            }, onBad);
        }

        $scope.createMonster = function () {
            $scope.error = '';
            monsterService.create($scope.currentMonster).then(function (good) {
                loadMonsters();
                $scope.resetMonster();
            }, onBad);
        }

        $scope.createArea = function () {
            $scope.error = '';
            areaService.create($scope.currentArea).then(function (good) {
                loadAreas();
                $scope.resetArea();
            }, onBad);
        }

        $scope.createRelic = function () {
            $scope.error = '';
            relicService.create($scope.currentRelic).then(function (good) {
                loadRelics();
                $scope.resetRelic();
            },onBad);
        }

        $scope.updateAreaLocation = function(id, area) {
            if (!angular.isDefined(area.locations)) {
                area.locations = [];
            }
            angular.forEach($scope.locations, function (loc) {
                if (loc.Id == id) {
                    area.locations.push(loc);
                }
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

        $scope.removeAreaLocation = function (id, area) {
            angular.forEach(area.locations, function (loc) {
                if (loc.Id == id) {
                    area.rooms.splice(loc, 1);
                }
            });
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
            relicService.update(relic).then(function (good) {
                loadRelics();
                $scope.resetRelic();
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        $scope.updateArea = function (area) {
            $scope.error = '';
            areaService.update(location).then(function (good) {
                loadAreas();
                $scope.resetArea();
            }, onBad);
        }

        $scope.updateLocation = function (location) {
            $scope.error = '';
            locationService.update(location).then(function (good) {
                loadLocations();
                $scope.resetLocation();
            }, onBad);
        }

        $scope.updateQuestGiver = function (questGiver) {
            $scope.error = '';
            editService.update(questGiver).then(function (good) {
                loadQuestGivers();
                $scope.resetGiver();
            }, onBad);
        }

        $scope.updateMonster = function (monster) {
            $scope.error = '';
            monsterService.update(monster).then(function (good) {
                loadMonsters();
                $scope.resetMonster();
            }, onBad);
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