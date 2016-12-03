angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.config', {
        url: '/config/',
        templateUrl: 'app/editor/views/config/config.html'
    });
    $urlRouterProvider.when('/editor/config', '/editor/config/');
});

angular.module('app.editor').controller('ConfigCtrl', function($scope, $timeout, ConfigSrv, GithubApiSrv) {
    $scope.init = function() {
        $scope.config = ConfigSrv.get();

        $scope.$watch('config', function(newVal, oldVal) {
            ConfigSrv.save();
        }, true);

        $scope.initialized = true;
    };

    $scope.reset = function() {
        ConfigSrv.load(ConfigSrv.default());
    };

    $timeout($scope.init, 50);
});
