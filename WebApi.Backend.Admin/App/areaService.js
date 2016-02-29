(function () {
    'use strict';

    angular
        .module('app')
        .service('areaService', areaService);

    areaService.$inject = ['$http'];

    function areaService($http) {
        this.defaultArea = function () {
            return {
                Name: '',
                Description: '',
                ImagePath: '',
                LocationIds: []
            };
        }

        this.create = function (model) {
            return $http.put('area/CreateArea', model);
        }

        this.delete = function (id) {
            return $http.delete('area/DeleteArea/' + id);
        }

        this.update = function (model) {
            var locationIds = [];
            if (model.locations != null) {
                angular.forEach(model.locations, function (loc) {
                    locationIds.push(loc.Id);
                });
            }
            return $http.post('area/UpdateArea/' + model.Id, {
                Name: model.name,
                Description: model.description,
                ImagePath: model.ImagePath,
                LocationIds: locationIds
            });
        }

        this.get = function () {
            return $http.get('area/GetAreas');
        }
    }
})();