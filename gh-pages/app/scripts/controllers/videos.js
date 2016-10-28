'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:VideosCtrl
 * @description
 * # VideosCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('VideosCtrl', function($scope, $rootScope, $location, $timeout, NgTableParams, StateSrv, DataSrv) {
    $scope.initFinished = false;

    $scope.init = function() {
        $scope.model = {};
        $scope.model = StateSrv.load($location.path(), $scope.model);

        $timeout(function () {
            $scope.initFinished = true;
        }, 100);
    };

    $timeout($scope.init, 0);
});
