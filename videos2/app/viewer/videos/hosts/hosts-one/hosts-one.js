angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.hosts.one', {
        url: '/:hostId',
        templateUrl: 'app/viewer/videos/hosts/hosts-one/hosts-one.html',
        controller: function($scope, $state, $stateParams, StateSrv, ChartTemplatesSrv, NgTableParams, VideosSrv, HostsSrv, ShowsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.hostId = $stateParams.hostId;
                $scope.host = HostsSrv.findById($scope.hostId);

                //videos
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { hosts: { filter: [$scope.hostId] }, online: true });
                $scope.videosOptions = {};

                //charts
                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosCountByDate($scope.videos, $scope.host.firstname));
                $scope.charts.push(ChartTemplatesSrv.videosDurationByDate($scope.videos, $scope.host.firstname));
                $scope.charts.push(ChartTemplatesSrv.videosViewsTotalByDate($scope.videos, $scope.host.firstname));
                $scope.charts.push(ChartTemplatesSrv.videosViewsMeanByDate($scope.videos, $scope.host.firstname));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, $scope.host.firstname));

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

                //no Co-hosts
                $scope.stats.videosCohostsNone = _.filter($scope.videos, function(video) {
                    return video.hosts.length === 1;
                }).length;

                //Co-hosts
                $scope.stats.videosCohosts = _($scope.videos)
                    .map(function(video) {
                        return video.hosts;
                    })
                    .flatten()
                    .filter(function(hostId) {
                        return hostId !== $scope.host.id;
                    })
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

                $scope.stats.videosCohostsTable = new NgTableParams({
                    count: 5,
                    sorting: { count: "desc" }
                }, {
                    dataset: $scope.stats.videosCohosts
                });

                //shows
                $scope.stats.videosShows = _($scope.videos)
                    .map(function(video) {
                        return video.shows;
                    })
                    .flatten()
                    .countBy(function(showId) {
                        return showId;
                    })
                    .map(function(count, showId) {
                        return {
                            show: ShowsSrv.findById(showId),
                            count: count
                        };
                    })
                    .value();

                $scope.stats.videosShowsTable = new NgTableParams({
                    count: 5,
                    sorting: { count: "desc" }
                }, {
                    dataset: $scope.stats.videosShows
                });
            };
        }
    });
});
