angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.hosts.all', {
        url: '/',
        templateUrl: 'app/editor/videos/hosts/hosts-all/hosts-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, HostsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.hosts = HostsSrv.all();
                $scope.table = {
                    header: {
                        title: 'Moderatoren',
                        add: $scope.add
                    },
                    params: new NgTableParams({}, {
                        dataset: $scope.hosts
                    }),
                    options: {
                        display: {
                            view: 'list',
                            count: 10
                        },
                        order: {
                            column: 'firstname',
                            type: 'asc'
                        },
                        filter: ''
                    },
                    views: [{
                        id: 'list',
                        name: 'Liste',
                        icon: 'fa-th-list',
                        template: 'app/editor/videos/hosts/hosts-all/hosts-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/editor/videos/hosts/hosts-all/hosts-all-card.html'
                    }]
                };

                StateSrv.watch($scope, ['exec']);
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
                $scope.table.params.reload();
            };
        }
    });
});
