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
                $scope.table = {
                    header: {
                        title: 'Kanäle'
                    },
                    params: new NgTableParams({}, {
                        dataset: $scope.channels
                    }),
                    options: {
                        display: {
                            view: 'list',
                            count: 10
                        },
                        order: {
                            column: 'title',
                            type: 'asc'
                        },
                        filter: ''
                    },
                    views: [{
                        id: 'list',
                        name: 'Liste',
                        icon: 'fa-th-list',
                        template: 'app/viewer/videos/channels/channels-all/channels-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/viewer/videos/channels/channels-all/channels-all-card.html'
                    }]
                };

                $scope.charts = [];
                $scope.charts.push($scope.chartVideosCount());
                $scope.charts.push($scope.chartDurationTotal());
                $scope.charts.push($scope.chartViewsTotal());
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
                        text: 'Gesamte Video Anzahl pro Kanal'
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
                            axisLabel: 'Anzahl Videos',
                            tickFormat: function(d) {
                                return d3.format('d')(d);
                            }
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
                $scope.table.params.reload();
            };
        }
    });
});
