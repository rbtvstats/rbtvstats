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
        controller: function($scope, InitSrv, ConfigSrv, StateSrv, LiveDataControllerSrv, VideosDataControllerSrv) {
            $scope.initDependencies = ['config', 'state'];

            $scope.init = function() {
                InitSrv.register('metadata-live', LiveDataControllerSrv.getRemoteMetadata());
                InitSrv.register('metadata-videos', VideosDataControllerSrv.getRemoteMetadata());
                InitSrv.register('videos-data', VideosDataControllerSrv.loadRemote());
            };

            InitSrv.register('config', ConfigSrv.loadLocal());
            InitSrv.register('state', StateSrv.loadLocal());
        }
    });
    $urlRouterProvider.otherwise('/videos/channels/');
});
