angular.module('app.editor', [
    'app.common',
    'app.data',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'ngAnimate',
    'ngTable',
    'angular-md5',
    'youtube-embed',
    'ng.jsoneditor'
]);

angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor', {
        abstract: true,
        url: '/editor',
        templateUrl: 'app/editor/app.editor.html'
    });
    $urlRouterProvider.when('/editor', '/editor/channels/');
});

angular.module('app.editor').controller('EditorCtrl', function($scope, $q, InitSrv, NavigationSrv, ConfigSrv, StateSrv, VideosDataBackupSrv, VideosDataControllerSrv) {
    $scope.init = function() {
        NavigationSrv.clear();
        NavigationSrv.register('/editor/channels/', 'Kanäle');
        NavigationSrv.register('/editor/shows/', 'Formate');
        NavigationSrv.register('/editor/hosts/', 'Moderatoren');
        NavigationSrv.register('/editor/series/', 'Serien');
        NavigationSrv.register('/editor/videos/', 'Videos');
        NavigationSrv.register('/editor/data/', 'Daten');
        NavigationSrv.register('/editor/config/', 'Einstellungen');

        var promises = [];
        promises.push(ConfigSrv.loadLocal());
        promises.push(StateSrv.loadLocal());
        promises.push(VideosDataBackupSrv.loadLocal());
        promises.push(VideosDataControllerSrv.loadAllLocal());

        return $q.all(promises);
    };

    InitSrv.init($scope, $scope.init);
});
