'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:ShowsCtrl
 * @description
 * # ShowsCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('ShowsCtrl', function($scope, StateSrv, ShowsSrv) {
    $scope.init = function() {
        $scope.shows = ShowsSrv.all();
        $scope.show = null;
        $scope.showSelected = {
            id: null
        };

        $scope.$watch('show', function(newVal, oldVal) {
            $scope.valid = ShowsSrv.isValid($scope.show);

            ShowsSrv.saveDelayed();
        }, true);

        StateSrv.watch($scope, ['showSelected']);
    };

    $scope.add = function() {
        $scope.show = ShowsSrv.create();
    };

    $scope.remove = function(show) {
        ShowsSrv.delete(show);

        $scope.show = null;
    };

    $scope.init();
});
