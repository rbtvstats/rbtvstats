'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:VideosCtrl
 * @description
 * # VideosCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('VideosCtrl', function($scope, $rootScope, $location, NgTableParams, StateSrv, DataSrv) {
    $scope.init = function() {
        $scope.model = {};
        $scope.model.videosTable = new NgTableParams({
            sorting: {
                published: 'desc'
            },
            count: 25
        }, {
            dataset: $scope.videos,
            filterOptions: {
                filterFn: $scope.customFilter
            }
        });

        $scope.model = StateSrv.load($location.path(), $scope.model);

        $scope.$on('updateData', function(event, args) {
            $scope.update();
        });

        if ($scope.model.dataLatest != $scope.metadata.time && $scope.metadata.time > 0) {
            $scope.update();
        }
    };

    $scope.update = function() {
        $scope.model.videosTable.reload();
    };

    $scope.init();
});
