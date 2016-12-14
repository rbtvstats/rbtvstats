angular.module('app.viewer', [
    'app.common',
    'app.data',
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'ui.select',
    'angularMoment',
    'ngTable',
    'nvd3'
]);

angular.module('app.viewer').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('viewer', {
        abstract: true,
        url: '',
        templateUrl: 'app/viewer/app.viewer.html'
    });
    $urlRouterProvider.otherwise('/videos/channels/');
});

angular.module('app.viewer').controller('ViewerCtrl', function($scope, $q, InitSrv, ConfigSrv, StateSrv, VideosDataBackupSrv, VideosDataControllerSrv) {
    $scope.init = function() {
        var promises = [];
        promises.push(ConfigSrv.loadLocal());
        promises.push(StateSrv.loadLocal());
        promises.push(VideosDataBackupSrv.loadLocal());
        promises.push(VideosDataControllerSrv.loadAllLocal());

        return $q.all(promises);
    };

    InitSrv.init($scope, $scope.init);
});
