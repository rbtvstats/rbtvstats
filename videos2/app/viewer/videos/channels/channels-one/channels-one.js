angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.channels.one', {
        url: '/:channelId',
        templateUrl: 'app/viewer/videos/channels/channels-one/channels-one.html',
        controller: function($scope, $state, $stateParams, ChartTemplatesSrv, VideosSrv, ChannelsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.channelId = $stateParams.channelId;
                $scope.channel = ChannelsSrv.findById($scope.channelId);
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { channels: { filter: [$scope.channelId] }, online: true });

                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosViewsMeanByDate($scope.videos, $scope.channel.title));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, $scope.channel.title));

                $scope.updateStats();
            };

            $scope.updateStats = function() {
                $scope.stats = {};

                //count
                $scope.stats.videosCountTotal = $scope.videos.length

                //count mean
                var publishedFirst = _.minBy($scope.videos, function(video) {
                    return video.published;
                });
                var publishedLast = _.maxBy($scope.videos, function(video) {
                    return video.published;
                });

                $scope.stats.videosCountMean = _.round($scope.stats.videosCountTotal / ((publishedLast.published - publishedFirst.published) / (60 * 60 * 24)), 2);

                //views mean
                $scope.stats.videosViewsMean = _.round(_.meanBy($scope.videos, function(video) {
                    return video.stats.viewCount;
                }));

                //duration mean
                $scope.stats.videosDurationMean = _.round(_.meanBy($scope.videos, function(video) {
                    return video.duration;
                }));
            };
        }
    });
});
