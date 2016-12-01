angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.config', {
        url: '/config/',
        templateUrl: 'app/editor/views/config/config.html'
    });
    $urlRouterProvider.when('/editor/config', '/editor/config/');
});

angular.module('app.editor').controller('ConfigCtrl', function($scope, ConfigSrv, DebounceSrv) {
    $scope.init = function() {
        $scope.config = ConfigSrv.get();

        console.log($scope.config)

        $scope.$watch('config', function(newVal, oldVal) {
            ConfigSrv.saveDelayed();
        }, true);
    };

    $scope.init();
});
