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
        templateUrl: 'app/viewer/app.viewer.html',
        controller: function($scope, $timeout, InitSrv, ConfigSrv, StateSrv, LiveDataSrv, VideosDataSrv) {
            $scope.initDependencies = ['config', 'state'];

            InitSrv.register({
                id: 'config',
                execute: ConfigSrv.loadLocal
            });
            InitSrv.register({
                id: 'state',
                execute: StateSrv.loadLocal
            });
            InitSrv.register({
                id: 'live-metadata',
                execute: LiveDataSrv.loadRemoteMetadata,
                dependencies: ['config']
            });
            InitSrv.register({
                id: 'videos-metadata',
                execute: VideosDataSrv.loadRemoteMetadata,
                dependencies: ['config']
            });
            InitSrv.register({
                id: 'videos-data',
                execute: VideosDataSrv.loadRemote,
                dependencies: ['videos-metadata']
            });
        }
    });
    $urlRouterProvider.otherwise('/videos/channels/');
});
