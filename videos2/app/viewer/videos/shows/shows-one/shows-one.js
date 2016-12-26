angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.shows.one', {
        url: '/:showId/:seriesId',
        templateUrl: 'app/viewer/videos/shows/shows-one/shows-one.html',
        controller: function($scope, $filter, $state, $stateParams, NgTableParams, ChartTemplatesSrv, VideosSrv, ShowsSrv, HostsSrv, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.showId = $stateParams.showId;
                $scope.seriesId = $stateParams.seriesId;
                $scope.show = ShowsSrv.findById($scope.showId);
                $scope.series = SeriesSrv.findById($scope.seriesId);
                $scope.showSeries = SeriesSrv.find({ show: $scope.showId });
                var seriesFilter = $scope.seriesId && [$scope.seriesId];
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { shows: { filter: [$scope.showId] }, series: { filter: seriesFilter }, online: true });

                $scope.tableSeries = {
                    header: {
                        title: 'Serien'
                    },
                    params: new NgTableParams({}, {
                        dataset: $scope.showSeries
                    }),
                    options: {
                        display: {
                            view: 'list',
                            count: 10
                        },
                        order: {
                            column: 'name',
                            type: 'asc'
                        },
                        filter: ''
                    },
                    views: [{
                        id: 'list',
                        name: 'Liste',
                        icon: 'fa-th-list',
                        template: 'app/viewer/videos/shows/shows-one/series-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/viewer/videos/shows/shows-one/series-all-card.html'
                    }]
                };

                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosViewsMeanByDate($scope.videos, $scope.show.name));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, $scope.show.name));

                $scope.updateStats();
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
