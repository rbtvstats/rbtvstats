angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.channels.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/channels/channels-all/channels-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, VideosSrv, ChannelsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { online: true });
                $scope.channels = ChannelsSrv.all();
                $scope.tableParams = new NgTableParams({
                    sorting: {
                        title: 'asc'
                    }
                }, {
                    dataset: $scope.channels,
                    counts: []
                });
                $scope.tableOptions = {
                    display: {
                        view: 'list',
                        count: 10
                    }
                };

                //view
                $scope.displayViewOptions = [
                    { value: 'list', name: 'Liste', icon: 'fa-th-list' },
                    { value: 'card', name: 'Kacheln', icon: 'fa-th-large' }
                ];
                $scope.displayCountOptions = [10, 25, 50];

                $scope.$watchCollection('tableOptions.display', function(newVal, oldVal) {
                    $scope.tableParams.count($scope.tableOptions.display.count);
                });

                StateSrv.watch($scope, ['tableOptions']);

                $scope.charts = [];
                $scope.charts.push($scope.chartVideosCount());
                $scope.charts.push($scope.chartDurationTotal());
                $scope.charts.push($scope.chartViewsTotal());
                $scope.charts.push($scope.chartViewsMean());
                $scope.charts.push($scope.chartViewsDistribution());
            };

            $scope.one = function(channel) {
                $state.go('viewer.videos.channels.one', { channelId: channel.id });
            };

            $scope.chartVideosCount = function() {
                var options = {
                    chart: {
                        type: 'multiBarChart',
                        xAxis: {
                            axisLabel: 'Datum'
                        },
                        yAxis: {
                            axisLabel: 'Anzahl Videos'
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
                        text: 'Video Anzahl pro Kanal'
                    }
                };

                function update() {
                    var filter = {
                        published: options.dateRange.selected
                    };

                    var videos = VideosSrv.filter($scope.videos, filter);
                    var videosByDate = VideosSrv.groupByDate(videos, 'channel', options.dateGroup.selected);

                    return _.map(videosByDate, function(data) {
                        var values = _.map(data.videos, function(data) {
                            return { x: data.date, y: data.videos.length };
                        });

                        var channel = ChannelsSrv.findById(data.target);

                        return {
                            key: channel.title,
                            columns: { x: 'date', y: 'count' },
                            values: values
                        };
                    });
                }

                return {
                    update: update,
                    options: options
                };
            };

            $scope.chartDurationTotal = function() {
                var options = {
                    chart: {
                        type: 'multiBarChart',
                        xAxis: {
                            axisLabel: 'Datum'

                        },
                        yAxis: {
                            axisLabel: 'Video Laufzeit (Stunden)',
                            tickFormat: function(d) {
                                return d3.format('.1f')(d / 3600) + 'h';
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
                        text: 'Gesamte Video Laufzeit pro Kanal'
                    }
                };

                function update() {
                    var filter = {
                        published: options.dateRange.selected
                    };

                    var videos = VideosSrv.filter($scope.videos, filter);
                    var videosByDate = VideosSrv.groupByDate(videos, 'channel', options.dateGroup.selected);

                    return _.map(videosByDate, function(data) {
                        var values = _.map(data.videos, function(data) {
                            var durationTotal = _.sumBy(data.videos, function(video) {
                                return video.duration;
                            });

                            return { x: data.date, y: durationTotal };
                        });

                        var channel = ChannelsSrv.findById(data.target);

                        return {
                            key: channel.title,
                            columns: { x: 'date', y: 'durationTotal' },
                            values: values
                        };
                    });
                }

                return {
                    update: update,
                    options: options
                };
            };

            $scope.chartViewsTotal = function() {
                var options = {
                    chart: {
                        type: 'multiBarChart',
                        xAxis: {
                            axisLabel: 'Datum'
                        },
                        yAxis: {
                            axisLabel: 'Video Aufrufe (Millionen)',
                            tickFormat: function(d) {
                                return d3.format('.2f')(d / 1000000) + 'M';
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
                        text: 'Gesamte Video Aufrufe pro Kanal'
                    }
                };

                function update() {
                    var filter = {
                        published: options.dateRange.selected
                    };

                    var videos = VideosSrv.filter($scope.videos, filter);
                    var videosByDate = VideosSrv.groupByDate(videos, 'channel', options.dateGroup.selected);

                    return _.map(videosByDate, function(data) {
                        var values = _.map(data.videos, function(data) {
                            var viewsTotal = _.sumBy(data.videos, function(video) {
                                return video.stats.viewCount;
                            });

                            return { x: data.date, y: viewsTotal };
                        });

                        var channel = ChannelsSrv.findById(data.target);

                        return {
                            key: channel.title,
                            columns: { x: 'date', y: 'viewsTotal' },
                            values: values
                        };
                    });
                }

                return {
                    update: update,
                    options: options
                };
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
                        text: 'Durchschnittliche Video Aufrufe pro Kanal'
                    }
                };

                function update() {
                    var filter = {
                        published: options.dateRange.selected
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
                        text: 'Verteilung der Video Aufrufe pro Kanal'
                    }
                };

                function update() {
                    var filter = {
                        published: options.dateRange.selected
                    };

                    var bucketSize = 2000;
                    var videos = VideosSrv.filter($scope.videos, filter);
                    var distribution = VideosSrv.groupByBuckets(videos, 'channel', function(video) {
                        return video.stats.viewCount;
                    }, bucketSize);

                    return _.map(distribution, function(data) {
                        var values = _.map(data.videos, function(data) {
                            return { x: data.bucket, y: data.videos.length };
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

            $scope.update = function() {
                $scope.tableParams.reload();
            };
        }
    });
});
