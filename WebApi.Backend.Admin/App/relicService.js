(function () {
    'use strict';

    angular
        .module('app')
        .service('relicService', monsterService);

    monsterService.$inject = ['$http'];

    function monsterService($http) {
        this.defaultRelic = function () {
            return {
                Name: '',
                Description: '',
                Value: 0
            };
        }

        this.create = function (model) {
            return $http.put('/relic/CreateRelic', model);
        }

        this.update = function (model) {
            return $http.post('/relic/UpdateRelic/' + model.Id, {
                Name: model.name,
                Description: model.description,
                Value: model.value
            });
        }

        this.delete = function (id) {
            return $http.delete('/relic/DeleteRelic/' + id);
        }

        this.get = function () {
            return $http.get('/relic/GetRelics');
        }
    }
})();