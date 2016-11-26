'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:SchemasCtrl
 * @description
 * # SchemasCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('SchemasCtrl', function($scope, StateSrv, DataControllerSrv) {
    $scope.init = function() {
        $scope.dataServices = DataControllerSrv.all();
        $scope.dataService = null;
        $scope.dataServiceSelected = {
            id: null
        };

        $scope.$watch('dataService', function(newVal, oldVal) {
            if ($scope.dataService) {
                $scope.dataService.service.saveSchemaDelayed();
            }
        }, true);

        StateSrv.watch($scope, ['dataServiceSelected']);
    };

    $scope.toList = function(obj) {
        return $.map(obj, function(value) {
            return [value];
        });
    };

    $scope.reset = function(dataService) {
        $scope.dataService.service.resetSchema();
    };

    $scope.init();
});
