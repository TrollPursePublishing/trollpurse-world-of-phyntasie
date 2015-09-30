(function () {
    'use strict';

    angular
        .module('app')
        .controller('editController', editController);

    editController.$inject = ['$scope', 'editService', 'authService']; 

    function editController($scope, editService, authService) {
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

        $scope.working = editService.zeroGUID;

        function loadLocations() {
            editService.getLocations().then(function (good) {
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
            editService.getMonsters().then(function (good) {
                $scope.monsters = angular.fromJson(good.data);
            }, function (bad) {
                var res = angular.fromJson(bad); $scope.error = bad.statusText;
            });
        }

        function loadRelics() {
            editService.getRelics().then(function (good) {
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

            switch ($scope.context.id) {
                case editService.monster.id:
                    loadMonsters();
                    break;
                case editService.area.id:
                    loadAreas();
                    break;
                case editService.location.id:
                    loadLocations();
                    break;
                case editService.room.id:
                    loadRooms();
                    break;
                case editService.relic.id:
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

        $scope.resetQuest = function () {
            $scope.currentQuest = angular.copy(defaultQuest);
        }

        $scope.resetGiver = function () {
            $scope.working = editService.zeroGUID;
            $scope.currentQuestGiver = angular.copy(defaultGiver);
        }

        activate();

        function activate() {
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
    }
})();
