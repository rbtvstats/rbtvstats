angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.channels.one', {
        url: '/:channelId',
        templateUrl: 'app/editor/views/channels/channels-one/channels-one.html',
        controller: function($scope, $state, $stateParams, Notification, InitSrv, YoutubeApiSrv, ChannelsSrv) {
            $scope.init = function() {
                $scope.channel = ChannelsSrv.findById($stateParams.channelId);

                $scope.$watch('channel', function(newVal, oldVal) {
                    $scope.valid = ChannelsSrv.isValid($scope.channel);

                    ChannelsSrv.save();
                }, true);
            };

            $scope.delete = function(channel) {
                ChannelsSrv.delete(({ id: channel.id }));
                ChannelsSrv.save();
                $state.transitionTo('editor.channels.all');
            };

            $scope.updateMetadata = function(channel, target) {
                $scope.loadingMetadata = true;
                YoutubeApiSrv.channels(target)
                    .then(function(data) {
                        if (data.items.length === 1) {
                            var item = data.items[0];
                            var details = item.contentDetails;
                            var snippet = item.snippet;
                            channel.channelId = item.id;
                            channel.playlistId = details.relatedPlaylists.uploads;
                            channel.description = snippet.description;
                            channel.title = snippet.title;
                            channel.image = snippet.thumbnails.medium.url;
                        }
                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Abrufen der Kanal Informationen',
                            err: err,
                            errPath: 'data.error.message',
                            delay: null
                        }));
                    })
                    .finally(function() {
                        $scope.loadingMetadata = false;
                    });
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
