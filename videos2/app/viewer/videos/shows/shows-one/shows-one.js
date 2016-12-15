angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.shows.one', {
        url: '/:showId',
        templateUrl: 'app/viewer/videos/shows/shows-one/shows-one.html',
        controller: function($scope, $stateParams, VideosSrv, ShowsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.showId = $stateParams.showId;
                $scope.show = ShowsSrv.findById($scope.showId);
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { shows: { filter: [$scope.showId] }, online: true });

                $scope.charts = [];
                $scope.charts.push($scope.chartViewsMean());
                $scope.charts.push($scope.chartViewsDistribution());
            };

            $scope.chartViewsMean = function() {
                var options = {
                    chart: {
                        type: 'multiBarChart',
                        xAxis: {
                            axisLabel: 'Datum'
                        },
                        yAxis: {
                            axisLabel: 'Durchschnittliche Video Aufrufe (Tausend)',
                            tickFormat: function(d) {
                                return d3.format('.2f')(d / 1000) + 'T';
                            }
                        }
                    },
                    dateGroup: {
                        enable: true,
                        selected: 'month'
                    },
                    dateRange: {
                        enable: true
                    },
                    title: {
                        enable: true,
                        text: 'Durchschnittliche Video Aufrufe'
                    }
                };

                function update() {
                    var filter = {
                        published: options.dateRange.selected
                    };

                    var videos = VideosSrv.filter($scope.videos, filter);
                    var videosByDate = VideosSrv.groupByDate(videos, null, options.dateGroup.selected);

                    var values = _.map(videosByDate, function(data) {
                        var viewsMean = Math.round(_.meanBy(data.videos, function(video) {
                            return video.stats.viewCount;
                        })) || 0;

                        return { x: data.date, y: viewsMean };
                    });

                    return {
                        key: $scope.show.name,
                        columns: { x: 'date', y: 'viewsMean' },
                        values: values
                    };
                }

                return {
                    update: update,
                    options: options
                };
            };

            $scope.chartViewsDistribution = function() {
                var options = {
                    chart: {
                        type: 'multiBarChart',
                        xAxis: {
                            axisLabel: 'Video Aufrufe (Tausend)',
                            tickFormat: function(d) {
                                return d3.format('d')(d / 1000) + 'T';
                            }
                        },
                        yAxis: {
                            axisLabel: 'Anzahl Videos'
                        }
                    },
                    dateRange: {
                        enable: true
                    },
                    title: {
                        enable: true,
                        text: 'Verteilung der Video Aufrufe'
                    }
                };

                function update() {
                    var filter = {
                        published: options.dateRange.selected
                    };

                    var bucketSize = 2000;
                    var videos = VideosSrv.filter($scope.videos, filter);
                    var distribution = VideosSrv.groupByBuckets(videos, null, function(video) {
                        return video.stats.viewCount;
                    }, bucketSize);

                    var values = _.map(distribution, function(data) {
                        return { x: data.bucket, y: data.videos.length };
                    });

                    return {
                        key: $scope.show.name,
                        columns: { x: 'bucket', y: 'count' },
                        values: values
                    };
                }

                return {
                    update: update,
                    options: options
                };
            };
        }
    });
});
