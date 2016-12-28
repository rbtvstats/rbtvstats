angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.hosts.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/hosts/hosts-all/hosts-all.html',
        controller: function($scope, $state, StateSrv, HostsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.hosts = HostsSrv.all();
                $scope.hostsOptions = {
                    display: {
                        view: 'list',
                        count: 10
                    },
                    order: {
                        column: 'firstname',
                        type: 'asc'
                    },
                    filter: ''
                };

                StateSrv.watch($scope, ['hostsOptions']);
            };
        }
    });
});
