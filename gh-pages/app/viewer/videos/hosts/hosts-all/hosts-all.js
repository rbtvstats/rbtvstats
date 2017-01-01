angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.hosts.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/hosts/hosts-all/hosts-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, HostsSrv, VideosSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.hosts = HostsSrv.all();
                $scope.hostsOptions = {
                    display: {
                        view: 'list',
                        count: 10
                    },
                    order: {
                        column: 'firstname',
                        type: 'asc'
                    },
                    filter: ''
                };

                //videos
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { online: true });

                $scope.updateStats();

                StateSrv.watch($scope, ['hostsOptions']);
            };

            $scope.updateStats = function() {
                $scope.stats = {};

                //count total
                $scope.stats.hostsCountTotal = $scope.hosts.length;

                //hosts stats
                $scope.stats.hosts = _($scope.videos)
                    .groupByArray(function(video) {
                        return video.hosts;
                    })
                    .map(function(videos, hostId) {
                        var stats = {};

                        //first
                        stats.videosFirst = _.minBy(videos, function(video) {
                            return video.published;
                        });

                        //last
                        stats.videosLast = _.maxBy(videos, function(video) {
                            return video.published;
                        });

                        //count total
                        stats.videosCountTotal = videos.length;

                        //count mean
                        var publishedFirstDate = moment.unix(stats.videosFirst.published);
                        var publishedLastDate = moment.unix(stats.videosLast.published);
                        var days = publishedLastDate.diff(publishedFirstDate, 'days') || 1;
                        stats.videosCountMean = _.round(stats.videosCountTotal / days, 2);

                        //duration total
                        stats.videosDurationTotal = _.sumBy(videos, function(video) {
                            return video.duration;
                        });

                        //duration mean
                        stats.videosDurationMean = _.round(_.meanBy(videos, function(video) {
                            return video.duration;
                        }));

                        //views total
                        stats.videosViewsTotal = _.sumBy(videos, function(video) {
                            return video.stats.viewCount;
                        });

                        //views mean
                        stats.videosViewsMean = _.round(_.meanBy(videos, function(video) {
                            return video.stats.viewCount;
                        }));

                        //views quartiles
                        var videosByViews = _.orderBy(videos, function(video) {
                            return video.stats.viewCount;
                        });
                        stats.videosViewsQ1 = _.round(d3.quantile(videosByViews, 0.25, function(video) {
                            return video.stats.viewCount;
                        }));
                        stats.videosViewsQ2 = _.round(d3.quantile(videosByViews, 0.5, function(video) {
                            return video.stats.viewCount;
                        }));
                        stats.videosViewsQ3 = _.round(d3.quantile(videosByViews, 0.75, function(video) {
                            return video.stats.viewCount;
                        }));

                        return {
                            host: HostsSrv.findById(hostId),
                            stats: stats
                        };
                    })
                    .value();

                $scope.stats.videosCountTable = new NgTableParams({
                    count: 5,
                    sorting: { 'stats.videosCountTotal': 'desc' }
                }, {
                    dataset: $scope.stats.hosts
                });

                $scope.stats.videosDurationTable = new NgTableParams({
                    count: 5,
                    sorting: { 'stats.videosDurationTotal': 'desc' }
                }, {
                    dataset: $scope.stats.hosts
                });

                $scope.stats.videosViewsTable = new NgTableParams({
                    count: 5,
                    sorting: { 'stats.videosViewsTotal': 'desc' }
                }, {
                    dataset: $scope.stats.hosts
                });
            };
        }
    });
});
