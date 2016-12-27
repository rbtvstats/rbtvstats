angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.hosts.all', {
        url: '/',
        templateUrl: 'app/editor/videos/hosts/hosts-all/hosts-all.html',
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
                $scope.exec = {
                    code: 'console.log(host);'
                };

                StateSrv.watch($scope, ['hostsOptions', 'exec']);
            };

            $scope.add = function() {
                var host = HostsSrv.create();
                HostsSrv.save();
                $state.transitionTo('editor.videos.hosts.one', { hostId: host.id });
            };

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.hosts, function(host) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };
        }
    });
});
