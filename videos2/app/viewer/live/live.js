angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.live', {
        url: '/live/?from&to',
        templateUrl: 'app/viewer/live/live.html',
        reloadOnSearch: false,
        controller: function($scope, $location, $stateParams, LiveDataSrv, $httpParamSerializer) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['live-metadata'];

            $scope.init = function() {
                $scope.from = $stateParams.from && parseInt($stateParams.from);
                $scope.to = $stateParams.to && parseInt($stateParams.to);
                $scope.live = LiveDataSrv.all();
                $scope.liveStats = null;

                $scope.chart = $scope.chartVideosCount();
            };

            $scope.chartVideosCount = function() {
                var metadata = LiveDataSrv.metadata();
                var latest = _.maxBy(metadata.files, function(file) {
                    return file.end;
                });
                latest = moment.unix(latest.end);

                var from = moment(latest).subtract(24, 'h').unix();
                var to = null;

                if (angular.isDefined($scope.from)) {
                    from = $scope.from;
                }

                if (angular.isDefined($scope.to)) {
                    to = $scope.to;
                }

                var options = {
                    chart: {
                        type: 'stackedAreaChart',
                        interpolate: 'linear',
                        showLegend: false,
                        xAxis: {
                            axisLabel: 'Datum',
                            tickFormatAutoDate: true
                        },
                        yAxis: {
                            axisLabel: 'Live Zuschauer'
                        },
                        tooltip: {
                            headerFormatter: function(d) {
                                return d3.time.format('%a %e. %b %Y %H:%M')(new Date(d * 1000));
                            }
                        },
                        margin: {
                            top: 20
                        }
                    },
                    dateRange: {
                        enable: true,
                        selected: {
                            start: from,
                            end: to
                        },
                        ranges: [{
                            name: 'Letzten 8 Stunden',
                            start: moment(latest).subtract(8, 'h').unix(),
                            end: null
                        }, {
                            name: 'Letzten 24 Stunden',
                            start: moment(latest).subtract(24, 'h').unix(),
                            end: null
                        }, {
                            name: 'Letzten 7 Tage',
                            start: moment(latest).subtract(7, 'd').unix(),
                            end: null
                        }, {
                            name: 'Letzter Monat',
                            start: moment(latest).subtract(30, 'd').unix(),
                            end: null
                        }, {
                            name: 'Letzten 3 Monate',
                            start: moment(latest).subtract(3, 'M').unix(),
                            end: null
                        }, {
                            name: 'Letztes Jahr',
                            start: moment(latest).subtract(1, 'y').unix(),
                            end: null
                        }, {
                            name: 'Seit Sendestart',
                            start: 1421276400,
                            end: null
                        }]
                    },
                    title: {
                        enable: true,
                        text: 'Live Zuschauer'
                    }
                };

                function update() {
                    var start = options.dateRange.selected.start;
                    var end = options.dateRange.selected.end;
                    $scope.liveStats = null;

                    $location.search({
                        from: start,
                        to: end
                    });

                    return LiveDataSrv.loadRemote(start, end)
                        .then(function() {
                            var data = LiveDataSrv.filter($scope.live, start, end);

                            var maxDatapoints = 3000;
                            var numDatapoints = data.length;
                            var step = 1;

                            if (numDatapoints > maxDatapoints) {
                                step = Math.floor(numDatapoints / maxDatapoints);
                            }

                            var values = [];
                            for (var i = 0; i < numDatapoints; i += step) {
                                var d = data[i];
                                values.push({ x: d.time, y: d.viewers });
                            }

                            $scope.liveStats = $scope.updateStats(data);

                            return {
                                key: 'Live Zuschauer',
                                columns: { x: 'time', y: 'viewers' },
                                values: values
                            };
                        });
                }

                return {
                    update: update,
                    options: options
                };
            };

            $scope.updateStats = function(data) {
                var stats = {};

                stats.count = data.length;
                stats.start = data[0];
                stats.end = data[data.length - 1];
                stats.mean = _.round(d3.mean(data, function(d) {
                    return d.viewers;
                }));

                data = _.orderBy(data, function(d) {
                    return d.viewers;
                });

                stats.min = data[0];
                stats.max = data[data.length - 1];
                stats.q1 = _.round(d3.quantile(data, 0.25, function(d) {
                    return d.viewers;
                }));
                stats.q2 = _.round(d3.quantile(data, 0.5, function(d) {
                    return d.viewers;
                }));
                stats.q3 = _.round(d3.quantile(data, 0.75, function(d) {
                    return d.viewers;
                }));

                return stats;
            };
        }
    });
});
