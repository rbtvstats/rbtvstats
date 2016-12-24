angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.series.one', {
        url: '/:seriesId',
        templateUrl: 'app/viewer/videos/series/series-one/series-one.html',
        controller: function($scope, $state, $stateParams, NgTableParams, ChartTemplatesSrv, VideosSrv, SeriesSrv, HostsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.seriesId = $stateParams.seriesId;
                $scope.series = SeriesSrv.findById($scope.seriesId);
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { series: { filter: [$scope.seriesId] }, online: true });

                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosViewsMeanByDate($scope.videos, $scope.series.name));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, $scope.series.name));

                $scope.updateStats();
            };

            $scope.toHost = function(host) {
                $state.transitionTo('viewer.videos.hosts.one', { hostId: host.id });
            };

            $scope.updateStats = function() {
                $scope.stats = {};

                //count
                $scope.stats.videosCountTotal = $scope.videos.length

                //mean views
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
