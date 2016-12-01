angular.module('app.editor').controller('ChannelsOneCtrl', function($scope, $state, $stateParams, YoutubeApiSrv, ChannelsSrv) {
    $scope.init = function() {
        $scope.channel = ChannelsSrv.findById($stateParams.channelId);

        $scope.$watch('channel', function(newVal, oldVal) {
            $scope.valid = ChannelsSrv.isValid($scope.channel);

            ChannelsSrv.saveDelayed();
        }, true);
    };

    $scope.delete = function(channel) {
        ChannelsSrv.delete(({ id: channel.id }));
        ChannelsSrv.saveDelayed();
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

                $scope.loadingMetadata = false;
            })
            .catch(function(err) {
                $scope.loadingMetadata = false;
            });
    };

    $scope.init();
});
