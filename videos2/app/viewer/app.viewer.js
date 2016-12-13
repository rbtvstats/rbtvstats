angular.module('app.viewer', [
    'app.common',
    'app.data',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'ngAnimate',
    'ngTable',
    'nvd3'
]);

angular.module('app.viewer').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('viewer', {
        abstract: true,
        url: '',
        templateUrl: 'app/viewer/app.viewer.html'
    });
    $urlRouterProvider.otherwise('/channels/');
});

angular.module('app.viewer').controller('ViewerCtrl', function($scope, $q, InitSrv, NavigationSrv, ConfigSrv, StateSrv, VideosDataBackupSrv, VideosDataControllerSrv) {
    $scope.init = function() {
        NavigationSrv.clear();
        NavigationSrv.register('/channels/', 'Kanäle');
        NavigationSrv.register('/shows/', 'Formate');
        NavigationSrv.register('/hosts/', 'Moderatoren');
        NavigationSrv.register('/series/', 'Serien');
        NavigationSrv.register('/videos/', 'Videos');
        NavigationSrv.register('/live/', 'Live');

        var promises = [];
        promises.push(ConfigSrv.loadLocal());
        promises.push(StateSrv.loadLocal());
        promises.push(VideosDataBackupSrv.loadLocal());
        promises.push(VideosDataControllerSrv.loadAllLocal());

        return $q.all(promises);
    };

    InitSrv.init($scope, $scope.init);
});
