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
        controller: function($scope, InitSrv, ConfigSrv, StateSrv, VideosDataBackupSrv, VideosDataControllerSrv) {
            $scope.initDependencies = ['config', 'state'];

            $scope.init = function() {
                InitSrv.register('videos-metadata', VideosDataControllerSrv.getRemoteMetadata());
                InitSrv.register('videos-data', VideosDataControllerSrv.loadLocal());
                InitSrv.register('videos-data-backup', VideosDataBackupSrv.loadLocal());
            };

            InitSrv.register('config', ConfigSrv.loadLocal());
            InitSrv.register('state', StateSrv.loadLocal());
        }
    });
    $urlRouterProvider.when('/editor/', '/editor/videos/data/');
});
