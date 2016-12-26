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
                        title: 'Kanäle'
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
                $scope.exec = {
                    code: 'console.log(channel);'
                };

                StateSrv.watch($scope, ['exec']);
            };

            $scope.add = function() {
                var channel = ChannelsSrv.create();
                ChannelsSrv.save();
                $state.transitionTo('editor.videos.channels.one', { channelId: channel.id });
            };

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.channels, function(channel) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };
        }
    });
});
