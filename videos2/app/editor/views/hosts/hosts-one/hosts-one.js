angular.module('app.editor').controller('HostsOneCtrl', function($scope, $timeout, $state, $stateParams, HostsSrv) {
    $scope.init = function() {
        $scope.host = HostsSrv.findById($stateParams.hostId);

        $scope.$watch('host', function(newVal, oldVal) {
            $scope.valid = HostsSrv.isValid($scope.host);

            HostsSrv.save();
        }, true);

        $scope.initialized = true;
    };

    $scope.delete = function(host) {
        HostsSrv.delete(({ id: host.id }));
        HostsSrv.save();
        $state.transitionTo('editor.hosts.all');
    };

    $timeout($scope.init, 50);
});
