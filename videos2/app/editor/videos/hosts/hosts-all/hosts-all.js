angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.hosts.all', {
        url: '/',
        templateUrl: 'app/editor/videos/hosts/hosts-all/hosts-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, HostsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

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
                $scope.exec = {
                    code: 'console.log(host);'
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

                StateSrv.watch($scope, ['tableOptions', 'exec']);
            };

            $scope.one = function(host) {
                $state.transitionTo('editor.videos.hosts.one', { hostId: host.id });
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

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.hosts, function(host) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };

            $scope.update = function() {
                $scope.tableParams.reload();
            };
        }
    });
});
