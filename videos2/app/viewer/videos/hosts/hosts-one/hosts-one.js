angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.hosts.one', {
        url: '/:hostId',
        templateUrl: 'app/viewer/videos/hosts/hosts-one/hosts-one.html',
        controller: function($scope, $state, $stateParams, ChartTemplatesSrv, NgTableParams, VideosSrv, HostsSrv, ShowsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.hostId = $stateParams.hostId;
                $scope.host = HostsSrv.findById($scope.hostId);
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { hosts: { filter: [$scope.hostId] }, online: true });

                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosCountByDate($scope.videos, $scope.host.firstname));
                $scope.charts.push(ChartTemplatesSrv.videosDurationByDate($scope.videos, $scope.host.firstname));
                $scope.charts.push(ChartTemplatesSrv.videosViewsMeanByDate($scope.videos, $scope.host.firstname));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, $scope.host.firstname));

                $scope.updateStats();
            };

            $scope.toHost = function(host) {
                $state.transitionTo('viewer.videos.hosts.one', { hostId: host.id });
            };

            $scope.toShow = function(show) {
                $state.transitionTo('viewer.videos.shows.one', { showId: show.id });
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
