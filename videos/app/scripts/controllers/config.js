'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:ConfigCtrl
 * @description
 * # ConfigCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('ConfigCtrl', function($scope, ConfigSrv, DebounceSrv) {
    $scope.init = function() {
        $scope.config = ConfigSrv.get();

        $scope.$watch('config', function(newVal, oldVal) {
            ConfigSrv.saveDelayed();
        }, true);
    };

    $scope.init();
});
