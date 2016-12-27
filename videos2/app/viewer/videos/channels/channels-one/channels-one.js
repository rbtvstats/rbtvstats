angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.channels.one', {
        url: '/:channelId',
        templateUrl: 'app/viewer/videos/channels/channels-one/channels-one.html',
        controller: function($scope, $state, $stateParams, StateSrv, ChartTemplatesSrv, VideosSrv, ChannelsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.channelId = $stateParams.channelId;
                $scope.channel = ChannelsSrv.findById($scope.channelId);

                //videos
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { channels: { filter: [$scope.channelId] }, online: true });
                $scope.videosOptions = {};

                //charts
                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosCountByDate($scope.videos, $scope.channel.title));
                $scope.charts.push(ChartTemplatesSrv.videosDurationByDate($scope.videos, $scope.channel.title));
                $scope.charts.push(ChartTemplatesSrv.videosViewsTotalByDate($scope.videos, $scope.channel.title));
                $scope.charts.push(ChartTemplatesSrv.videosViewsMeanByDate($scope.videos, $scope.channel.title));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, $scope.channel.title));

                $scope.updateStats();

                StateSrv.watch($scope, ['videosOptions']);
            };

            $scope.updateStats = function() {
                $scope.stats = {};

                var publishedFirst = _.minBy($scope.videos, function(video) {
                    return video.published;
                });
                var publishedLast = _.maxBy($scope.videos, function(video) {
                    return video.published;
                });

                publishedFirst = moment.unix(publishedFirst.published);
                publishedLast = moment.unix(publishedLast.published);
                var days = publishedLast.diff(publishedFirst, 'days') || 1;

                //count total
                $scope.stats.videosCountTotal = $scope.videos.length

                //count mean
                $scope.stats.videosCountMean = _.round($scope.stats.videosCountTotal / days, 2);

                //duration total
                $scope.stats.videosDurationTotal = _.sumBy($scope.videos, function(video) {
                    return video.duration;
                });

                //duration mean
                $scope.stats.videosDurationMean = _.round(_.meanBy($scope.videos, function(video) {
                    return video.duration;
                }));

                //views total
                $scope.stats.videosViewsTotal = _.sumBy($scope.videos, function(video) {
                    return video.stats.viewCount;
                });

                //views mean
                $scope.stats.videosViewsMean = _.round(_.meanBy($scope.videos, function(video) {
                    return video.stats.viewCount;
                }));
            };
        }
    });
});
