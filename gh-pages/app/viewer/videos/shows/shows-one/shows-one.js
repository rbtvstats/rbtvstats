angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.shows.one', {
        url: '/:showId/:seriesId',
        templateUrl: 'app/viewer/videos/shows/shows-one/shows-one.html',
        controller: function($scope, $filter, $state, $stateParams, NgTableParams, StateSrv, ChartTemplatesSrv, VideosSrv, ShowsSrv, HostsSrv, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.showId = $stateParams.showId;
                $scope.seriesId = $stateParams.seriesId;
                $scope.show = ShowsSrv.findById($scope.showId);
                $scope.series = SeriesSrv.findById($scope.seriesId);

                //series
                $scope.showSeries = SeriesSrv.find({ show: $scope.showId });
                $scope.seriesOptions = {
                    display: {
                        view: 'card',
                        count: 10
                    },
                    order: {
                        column: 'name',
                        type: 'asc'
                    },
                    filter: ''
                };

                //videos
                var seriesFilter = $scope.seriesId && [$scope.seriesId];
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { shows: { filter: [$scope.showId] }, series: { filter: seriesFilter }, online: true });
                $scope.videosOptions = {};

                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosCountByDate($scope.videos, $scope.show.name));
                $scope.charts.push(ChartTemplatesSrv.videosDurationByDate($scope.videos, $scope.show.name));
                $scope.charts.push(ChartTemplatesSrv.videosViewsTotalByDate($scope.videos, $scope.show.name));
                $scope.charts.push(ChartTemplatesSrv.videosViewsMeanByDate($scope.videos, $scope.show.name));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, $scope.show.name));

                $scope.updateStats();

                StateSrv.watch($scope, ['seriesOptions', 'videosOptions']);
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
                $scope.stats.videosCountTotal = $scope.videos.length;

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

                //hosts
                $scope.stats.videosHosts = _($scope.videos)
                    .map(function(video) {
                        return video.hosts;
                    })
                    .flatten()
                    .countBy(function(hostId) {
                        return hostId;
                    })
                    .map(function(count, hostId) {
                        return {
                            host: HostsSrv.findById(hostId),
                            count: count
                        };
                    })
                    .value();

                $scope.stats.videosHostsTable = new NgTableParams({
                    count: 5,
                    sorting: { count: "desc" }
                }, {
                    dataset: $scope.stats.videosHosts
                });
            };
        }
    });
});
