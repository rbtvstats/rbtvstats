'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:ChannelsCtrl
 * @description
 * # ChannelsCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('ChannelsCtrl', function($scope, StateSrv, YoutubeSrv, ChannelsSrv) {
    $scope.init = function() {
        $scope.channels = ChannelsSrv.all();
        $scope.channel = null;
        $scope.channelSelected = {
            selected: null
        };

        $scope.$watch('channel', function(newVal, oldVal) {
            $scope.valid = ChannelsSrv.isValid($scope.channel);

            ChannelsSrv.saveDelayed();
        }, true);

        StateSrv.watch($scope, ['channelSelected']);
    };

    $scope.add = function() {
        $scope.channel = ChannelsSrv.create();
    };

    $scope.remove = function(channel) {
        ChannelsSrv.delete(channel);

        $scope.channel = null;
    };

    $scope.updateMetadata = function(channel, target) {
        $scope.loadingMetadata = true;
        YoutubeSrv.channels(target)
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
