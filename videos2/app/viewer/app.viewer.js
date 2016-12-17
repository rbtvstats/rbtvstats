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
        controller: function($scope, DependencySrv, ConfigSrv, StateSrv, LiveDataSrv, VideosDataSrv) {
            $scope.initDependencies = ['config', 'state'];

            DependencySrv.register('config', ConfigSrv.loadLocal);
            DependencySrv.register('state', StateSrv.loadLocal);
            DependencySrv.register('live-metadata', LiveDataSrv.loadRemoteMetadata);
            DependencySrv.register('videos-metadata', VideosDataSrv.loadRemoteMetadata);
            DependencySrv.register('videos-data', VideosDataSrv.loadRemote);
        }
    });
    $urlRouterProvider.otherwise('/videos/channels/');
});
