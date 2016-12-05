angular.module('app.editor', ['ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'app.common',
    'app.data',
    'app.editor.utils',
    'ngTable',
    'ui.select',
    'youtube-embed',
    'angular-md5'
]);

angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor', {
        abstract: true,
        url: '/editor',
        templateUrl: 'app/editor/app.editor.html'
    });
    $urlRouterProvider.when('/editor', '/editor/channels/');
    $urlRouterProvider.otherwise('/editor');
});

angular.module('app.data.videos').run(function($rootScope, $q, ConfigSrv, StateSrv, VideosDataControllerSrv, VideosDataBackupSrv) {
    var promises = [];
    promises.push(ConfigSrv.loadLocal());
    promises.push(StateSrv.loadLocal());
    promises.push(VideosDataControllerSrv.loadAllLocal());
    promises.push(VideosDataBackupSrv.loadLocal());

    $q.all(promises)
        .then(function() {
            //do nothing
        })
        .catch(function(err) {
            //should not happen
        })
        .finally(function() {
            $rootScope.appInitialized = true;
        })
});
