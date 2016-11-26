'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:SeriesCtrl
 * @description
 * # SeriesCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('SeriesCtrl', function($scope, StateSrv, SeriesSrv) {
    $scope.init = function() {
        $scope.series = SeriesSrv.all();
        $scope.series_ = null;
        $scope.seriesSelected = {
            id: null
        };

        $scope.$watch('series_', function(newVal, oldVal) {
            $scope.valid = SeriesSrv.isValid($scope.series_);

            SeriesSrv.saveDelayed();
        }, true);

        StateSrv.watch($scope, ['seriesSelected']);
    };

    $scope.add = function() {
        $scope.series_ = SeriesSrv.create();
    };

    $scope.remove = function(series_) {
        SeriesSrv.delete(series_);

        $scope.series_ = null;
    };

    $scope.init();
});
