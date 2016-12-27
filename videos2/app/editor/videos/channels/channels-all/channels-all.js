angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.channels.all', {
        url: '/',
        templateUrl: 'app/editor/videos/channels/channels-all/channels-all.html',
        controller: function($scope, $state, StateSrv, ChannelsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.channels = ChannelsSrv.all();
                $scope.channelsOptions = {
                    display: {
                        view: 'card',
                        count: 10
                    },
                    order: {
                        column: 'title',
                        type: 'asc'
                    },
                    filter: ''
                };
                $scope.exec = {
                    code: 'console.log(channel);'
                };

                StateSrv.watch($scope, ['channelsOptions', 'exec']);
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
