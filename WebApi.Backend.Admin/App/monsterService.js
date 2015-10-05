(function () {
    'use strict';

    angular
        .module('app')
        .service('monsterService', monsterService);

    monsterService.$inject = ['$http'];

    function monsterService($http) {        
        this.defaultMonster = function () {
            return {
                Name: '',
                Description: '',
                Strength: 0,
                Toughness: 0,
                Health: 0,
                Level: 0,
                Type: "0"
            };
        }

        this.create = function (model) {
            return $http.put('/monster/CreateMonster', model);
        }

        this.update = function (model) {
            return $http.post('/monster/UpdateMonster/' + model.Id, {
                Name: model.name,
                Description: model.description,
                Strength: model.attribute.strength,
                Toughness: model.attribute.toughness,
                Health: model.attribute.health,
                Level: model.attribute.level,
                Type: model.type
            });
        }

        this.delete = function (id) {
            return $http.delete('/monster/DeleteMonster/' + id);
        }

        this.get = function () {
            return $http.get('/monster/GetMonsters');
        }
    }
})();