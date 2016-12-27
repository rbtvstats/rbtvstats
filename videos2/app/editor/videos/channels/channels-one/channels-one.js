angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.channels.one', {
        url: '/:channelId',
        templateUrl: 'app/editor/videos/channels/channels-one/channels-one.html',
        controller: function($scope, $state, $stateParams, Notification, StateSrv, YoutubeApiSrv, VideosSrv, ChannelsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.channelId = $stateParams.channelId;
                $scope.channel = ChannelsSrv.findById($scope.channelId);

                //videos
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { channels: { filter: [$scope.channelId] } });
                $scope.videosOptions = {};

                $scope.$watch('channel', function(newVal, oldVal) {
                    $scope.valid = ChannelsSrv.isValid($scope.channel);

                    ChannelsSrv.save();
                }, true);

                StateSrv.watch($scope, ['videosOptions']);
            };

            $scope.delete = function(channel) {
                ChannelsSrv.delete(({ id: channel.id }));
                ChannelsSrv.save();
                $state.transitionTo('editor.videos.channels.all');
            };

            $scope.fetchMetadata = function(channel, target) {
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
                    });
            };
        }
    });
});
