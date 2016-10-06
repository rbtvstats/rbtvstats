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
        $scope.model = StateSrv.load($location.path(), $scope.model);
    };

    $scope.init();
});
