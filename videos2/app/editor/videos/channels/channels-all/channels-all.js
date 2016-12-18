angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.channels.all', {
        url: '/',
        templateUrl: 'app/editor/videos/channels/channels-all/channels-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, ChannelsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.channels = ChannelsSrv.all();
                $scope.table = {
                    header: {
                        title: 'Kanäle',
                        add: $scope.add
                    },
                    params: new NgTableParams({}, {
                        dataset: $scope.channels
                    }),
                    options: {
                        display: {
                            view: 'list',
                            count: 10
                        },
                        order: {
                            column: 'title',
                            type: 'asc'
                        },
                        filter: ''
                    },
                    views: [{
                        id: 'list',
                        name: 'Liste',
                        icon: 'fa-th-list',
                        template: 'app/editor/videos/channels/channels-all/channels-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/editor/videos/channels/channels-all/channels-all-card.html'
                    }]
                };

                StateSrv.watch($scope, ['tableOptions', 'exec']);
            };

            $scope.one = function(channel) {
                $state.go('editor.videos.channels.one', { channelId: channel.id });
            };

            $scope.add = function() {
                var channel = ChannelsSrv.create();
                ChannelsSrv.save();
                $scope.one(channel);
            };

            $scope.delete = function(channel) {
                ChannelsSrv.delete({ id: channel.id });
                ChannelsSrv.save();
                $scope.update();
            };

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.channels, function(channel) {';
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
