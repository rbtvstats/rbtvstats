angular.module('app.editor').controller('HostsAllCtrl', function($scope, $timeout, $state, NgTableParams, StateSrv, HostsSrv) {
    $scope.init = function() {
        $scope.hosts = HostsSrv.all();
        $scope.tableParams = new NgTableParams({
            sorting: {
                firstname: 'asc'
            },
            count: 25
        }, {
            dataset: $scope.hosts,
            counts: []
        });
        $scope.tableOptions = {
            display: {
                view: 'list',
                count: 25
            }
        };

        //view
        $scope.displayViewOptions = [
            { value: 'list', name: 'Liste', icon: 'fa-th-list' },
            { value: 'card', name: 'Kacheln', icon: 'fa-th-large' }
        ];
        $scope.displayCountOptions = [10, 25, 50];

        $scope.$watchCollection('tableOptions.display', function(newVal, oldVal) {
            $scope.tableParams.count($scope.tableOptions.display.count);
        });

        StateSrv.watch($scope, ['tableOptions']);

        $scope.initialized = true;
    };

    $scope.one = function(host) {
        $state.transitionTo('editor.hosts.one', { hostId: host.id });
    };

    $scope.add = function() {
        var host = HostsSrv.create();
        HostsSrv.save();
        $scope.one(host);
    };

    $scope.delete = function(host) {
        HostsSrv.delete({ id: host.id });
        HostsSrv.save();
        $scope.update();
    };

    $scope.update = function() {
        $scope.tableParams.reload();
    };

    $timeout($scope.init, 50);
});
