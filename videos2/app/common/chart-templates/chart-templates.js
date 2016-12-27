angular.module('app.common').factory('ChartTemplatesSrv', function(VideosSrv) {
    var service = {};

    service.videosCountByDate = function(videos, key, target) {
        var options = {
            chart: {
                type: 'multiBarChart',
                xAxis: {
                    axisLabel: 'Datum'
                },
                yAxis: {
                    axisLabel: 'Video Anzahl'
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
                text: 'Gesamte Video Anzahl'
            }
        };

        function update() {
            var filter = {
                published: options.dateRange.selected
            };

            var videosFiltered = VideosSrv.filter(videos, filter);
            var videosByDate = VideosSrv.groupByDate(videosFiltered, target, options.dateGroup.selected);

            return _.map(videosByDate, function(data) {
                var values = _.map(data.videos, function(data) {
                    return { x: data.date, y: data.videos.length };
                });

                var k = key;
                if (angular.isFunction(key)) {
                    k = key(data);
                }

                return {
                    key: k,
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

    service.videosDurationByDate = function(videos, key, target) {
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
                text: 'Gesamte Video Laufzeit'
            }
        };

        function update() {
            var filter = {
                published: options.dateRange.selected
            };

            var videosFiltered = VideosSrv.filter(videos, filter);
            var videosByDate = VideosSrv.groupByDate(videosFiltered, target, options.dateGroup.selected);

            return _.map(videosByDate, function(data) {
                var values = _.map(data.videos, function(data) {
                    var durationTotal = _.sumBy(data.videos, function(video) {
                        return video.duration;
                    });

                    return { x: data.date, y: durationTotal };
                });

                var k = key;
                if (angular.isFunction(key)) {
                    k = key(data);
                }

                return {
                    key: k,
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

    service.videosViewsTotalByDate = function(videos, key, target) {
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
                text: 'Gesamte Video Aufrufe'
            }
        };

        function update() {
            var filter = {
                published: options.dateRange.selected
            };

            var videosFiltered = VideosSrv.filter(videos, filter);
            var videosByDate = VideosSrv.groupByDate(videosFiltered, target, options.dateGroup.selected);

            return _.map(videosByDate, function(data) {
                var values = _.map(data.videos, function(data) {
                    var viewsTotal = _.sumBy(data.videos, function(video) {
                        return video.stats.viewCount;
                    });

                    return { x: data.date, y: viewsTotal };
                });

                var k = key;
                if (angular.isFunction(key)) {
                    k = key(data);
                }

                return {
                    key: k,
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

    service.videosViewsMeanByDate = function(videos, key, target) {
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

            var videosFiltered = VideosSrv.filter(videos, filter);
            var videosByDate = VideosSrv.groupByDate(videosFiltered, target, options.dateGroup.selected);

            return _.map(videosByDate, function(data) {
                var values = _.map(data.videos, function(data) {
                    var viewsMean = Math.round(_.meanBy(data.videos, function(video) {
                        return video.stats.viewCount;
                    })) || 0;

                    return { x: data.date, y: viewsMean };
                });

                var k = key;
                if (angular.isFunction(key)) {
                    k = key(data);
                }

                return {
                    key: k,
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

    service.videosViewsDistribution = function(videos, key, target) {
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
                    axisLabel: 'Video Anzahl',
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
                text: 'Verteilung der Video Aufrufe'
            }
        };

        function update() {
            var filter = {
                published: options.dateRange.selected
            };

            var bucketSize = 2000;
            var videosFiltered = VideosSrv.filter(videos, filter);
            var distribution = VideosSrv.groupByBuckets(videosFiltered, target, function(video) {
                return video.stats.viewCount;
            }, bucketSize);

            return _.map(distribution, function(data) {
                var values = _.map(data.videos, function(data) {
                    return { x: data.bucket, y: data.videos.length };
                });

                var k = key;
                if (angular.isFunction(key)) {
                    k = key(data);
                }

                return {
                    key: k,
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

    return service;
});
