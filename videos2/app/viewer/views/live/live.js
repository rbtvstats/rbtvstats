angular.module('app.viewer').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('viewer.live', {
        url: '/live/',
        templateUrl: 'app/viewer/views/live/live.html',
        controller: function($scope, InitSrv) {
            $scope.init = function() {

            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
    $urlRouterProvider.when('/live', '/live/');
});
