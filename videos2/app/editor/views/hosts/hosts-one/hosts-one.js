angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.hosts.one', {
        url: '/:hostId',
        templateUrl: 'app/editor/views/hosts/hosts-one/hosts-one.html',
        controller: function($scope, $state, $stateParams, InitSrv, HostsSrv) {
            $scope.init = function() {
                $scope.host = HostsSrv.findById($stateParams.hostId);

                $scope.$watch('host', function(newVal, oldVal) {
                    $scope.valid = HostsSrv.isValid($scope.host);

                    HostsSrv.save();
                }, true);
            };

            $scope.delete = function(host) {
                HostsSrv.delete(({ id: host.id }));
                HostsSrv.save();
                $state.transitionTo('editor.hosts.all');
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
