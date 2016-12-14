angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.live', {
        url: '/live/',
        templateUrl: 'app/viewer/live/live.html',
        controller: function($scope, InitSrv) {
            $scope.init = function() {

            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
