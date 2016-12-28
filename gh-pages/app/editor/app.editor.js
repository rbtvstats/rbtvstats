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
        controller: function($scope, InitSrv, ConfigSrv, StateSrv, VideosDataSrv, VideosDataBackupSrv, LiveDataSrv) {
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
                execute: LiveDataSrv.loadRemoteMetadata
            });
            InitSrv.register({
                id: 'videos-metadata',
                execute: VideosDataSrv.loadRemoteMetadata
            });
            InitSrv.register({
                id: 'videos-data',
                execute: VideosDataSrv.loadLocal
            });
            InitSrv.register({
                id: 'videos-data-backup',
                execute: VideosDataBackupSrv.loadLocal
            });
        }
    });
    $urlRouterProvider.when('/editor/', '/editor/videos/data/');
});
