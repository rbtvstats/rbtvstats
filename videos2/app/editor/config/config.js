angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.config', {
        url: '/config/',
        templateUrl: 'app/editor/config/config.html',
        controller: function($scope, InitSrv, ConfigSrv, GithubApiSrv) {
            $scope.init = function() {
                $scope.config = ConfigSrv.get();

                $scope.$watch('config', function(newVal, oldVal) {
                    ConfigSrv.save();
                }, true);
            };

            $scope.reset = function() {
                ConfigSrv.load(ConfigSrv.default());
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
