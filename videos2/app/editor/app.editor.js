angular.module('app.editor', [
    'app.common',
    'app.data',
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'ui.select',
    'angularMoment',
    'ngTable',
    'angular-md5',
    'youtube-embed',
    'ng.jsoneditor'
]);

angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor', {
        abstract: true,
        url: '/editor',
        templateUrl: 'app/editor/app.editor.html',
        controller: function($scope, DependencySrv, ConfigSrv, StateSrv, VideosDataSrv, VideosDataBackupSrv, LiveDataSrv) {
            $scope.initDependencies = ['config', 'state'];

            DependencySrv.register('config', ConfigSrv.loadLocal);
            DependencySrv.register('state', StateSrv.loadLocal);
            DependencySrv.register('live-metadata', LiveDataSrv.loadRemoteMetadata);
            DependencySrv.register('videos-metadata', VideosDataSrv.loadRemoteMetadata);
            DependencySrv.register('videos-data', VideosDataSrv.loadLocal);
            DependencySrv.register('videos-data-backup', VideosDataBackupSrv.loadLocal);
        }
    });
    $urlRouterProvider.when('/editor/', '/editor/videos/data/');
});
