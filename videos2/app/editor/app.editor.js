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
        templateUrl: 'app/editor/app.editor.html'
    });
    $urlRouterProvider.when('/editor', '/editor/channels/');
});

angular.module('app.editor').controller('EditorCtrl', function($scope, $q, InitSrv, ConfigSrv, StateSrv, VideosDataBackupSrv, VideosDataControllerSrv) {
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
