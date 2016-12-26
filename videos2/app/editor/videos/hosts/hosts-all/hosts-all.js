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
                        title: 'Moderatoren'
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
                $scope.exec = {
                    code: 'console.log(host);'
                };

                StateSrv.watch($scope, ['exec']);
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
