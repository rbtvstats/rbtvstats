angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.hosts.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/hosts/hosts-all/hosts-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, HostsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.hosts = HostsSrv.all();
                $scope.tableParams = new NgTableParams({
                    sorting: {
                        firstname: 'asc'
                    },
                    count: 10
                }, {
                    dataset: $scope.hosts,
                    counts: []
                });
                $scope.tableOptions = {
                    display: {
                        view: 'list',
                        count: 10
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
            };

            $scope.one = function(host) {
                $state.transitionTo('viewer.videos.hosts.one', { hostId: host.id });
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
        }
    });
});
