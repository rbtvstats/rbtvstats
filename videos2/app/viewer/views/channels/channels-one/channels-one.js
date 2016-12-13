angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.channels.one', {
        url: '/:channelId',
        templateUrl: 'app/viewer/views/channels/channels-one/channels-one.html',
        controller: function($scope, $state, $stateParams, InitSrv, VideosSrv, ChannelsSrv) {
            $scope.init = function() {
                $scope.channelId = $stateParams.channelId;
                $scope.channel = ChannelsSrv.findById($scope.channelId);
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { channels: { filter: [$scope.channelId] }, online: true });

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
                        published: {
                            start: options.dateRange.selected.startDate,
                            end: options.dateRange.selected.endDate
                        }
                    };

                    var videos = VideosSrv.filter($scope.videos, filter);
                    var videosByDate = VideosSrv.groupByDate(videos, 'channel', options.dateGroup.selected);

                    return _.map(videosByDate, function(data) {
                        var values = _.map(data.videos, function(data) {
                            var viewsMean = Math.round(_.meanBy(data.videos, function(video) {
                                return video.stats.viewCount;
                            })) || 0;

                            return { x: data.date, y: viewsMean };
                        });

                        var channel = ChannelsSrv.findById(data.target);

                        return {
                            key: channel.title,
                            columns: { x: 'date', y: 'viewsMean' },
                            values: values
                        };
                    });
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
                        published: {
                            start: options.dateRange.selected.startDate,
                            end: options.dateRange.selected.endDate
                        }
                    };

                    var bucketSize = 2000;
                    var videos = VideosSrv.filter($scope.videos, filter);
                    var distribution = VideosSrv.groupByBuckets(videos, 'channel', function(video) {
                        return video.stats.viewCount;
                    }, bucketSize);

                    return _.map(distribution, function(data) {
                        var values = _.map(data.videos, function(data) {
                            return { x: data.bucket, y: data.videos.length }
                        });

                        var channel = ChannelsSrv.findById(data.target);

                        return {
                            key: channel.title,
                            columns: { x: 'bucket', y: 'count' },
                            values: values
                        };
                    });
                }

                return {
                    update: update,
                    options: options
                };
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
