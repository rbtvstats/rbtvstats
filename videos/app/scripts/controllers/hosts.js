'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:HostsCtrl
 * @description
 * # HostsCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('HostsCtrl', function($scope, StateSrv, HostsSrv) {
    $scope.init = function() {
        $scope.hosts = HostsSrv.all();
        $scope.host = null;
        $scope.hostSelected = {
            id: null
        };

        $scope.$watch('host', function(newVal, oldVal) {
            $scope.valid = HostsSrv.isValid($scope.host);

            HostsSrv.saveDelayed();
        }, true);

        StateSrv.watch($scope, ['hostSelected']);
    };

    $scope.add = function() {
        $scope.host = HostsSrv.create();
    };

    $scope.remove = function(host) {
        HostsSrv.delete(host);

        $scope.host = null;
    };

    $scope.init();
});
