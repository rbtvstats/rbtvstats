angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.live', {
        url: '/live/?from&to',
        templateUrl: 'app/viewer/live/live.html',
        reloadOnSearch: false,
        controller: function($scope, $rootScope, $location, $state, $stateParams, LiveDataSrv, $httpParamSerializer) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['live-metadata'];

            $scope.init = function() {
                $scope.from = $stateParams.from && parseInt($stateParams.from);
                $scope.to = $stateParams.to && parseInt($stateParams.to);
                $scope.live = LiveDataSrv.all();
                $scope.liveStats = null;

                $scope.chart = $scope.chartLiveViewers();

                $scope.$watch('chart.options.dateRange.selected', function(newVal, oldVal) {
                    if (!$scope.chart.options.dateRange.selected.start) {
                        $scope.chart.options.dateRange.selected.start = $scope.chart.options.dateRange.minDate;
                    }

                    if (!$scope.chart.options.dateRange.selected.end) {
                        $scope.chart.options.dateRange.selected.end = $scope.chart.options.dateRange.maxDate;
                    }

                    $state.transitionTo('viewer.live', {
                        from: $scope.chart.options.dateRange.selected.start,
                        to: $scope.chart.options.dateRange.selected.end
                    });
                }, true);

                $scope.$on('$locationChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                    $scope.chart.options.dateRange.selected.start = $stateParams.from && parseInt($stateParams.from);
                    $scope.chart.options.dateRange.selected.end = $stateParams.to && parseInt($stateParams.to);
                });
            };

            $rootScope.changeDate = function(num, type) {
                var start = moment.unix($scope.chart.options.dateRange.selected.start);
                var end = moment.unix($scope.chart.options.dateRange.selected.end);
                var minDate = moment.unix($scope.chart.options.dateRange.minDate);
                var maxDate = moment.unix($scope.chart.options.dateRange.maxDate);

                if (num < 0) {
                    num = Math.abs(num);
                    start.subtract(num, type);
                    end.subtract(num, type);
                } else {
                    start.add(num, type);
                    end.add(num, type);
                }

                var diff = end.diff(start) / 1000;
                if (start < minDate || end < minDate) {
                    start = moment(minDate);
                    end = moment(minDate).add(diff, 's');
                }

                if (start > maxDate || end > maxDate) {
                    start = moment(maxDate).subtract(diff, 's');
                    end = moment(maxDate);
                }

                $scope.chart.options.dateRange.selected.start = start.unix();
                $scope.chart.options.dateRange.selected.end = end.unix();
            };

            $scope.chartLiveViewers = function() {
                var metadata = LiveDataSrv.metadata();
                var files = _(metadata.streams).map('files').flatten().value();
                var earliest = _.minBy(files, 'start');
                var latest = _.maxBy(files, 'end');
                earliest = moment.unix(earliest.start);
                latest = moment.unix(latest.end);

                var from = moment(latest).subtract(24, 'h').unix();
                var to = moment(latest).unix();

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
                        showLegend: true,
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
                        minDate: earliest.unix(),
                        maxDate: latest.unix(),
                        ranges: [{
                            name: 'Letzten 8 Stunden',
                            start: moment(latest).subtract(8, 'h').unix(),
                            end: moment(latest).unix()
                        }, {
                            name: 'Letzten 24 Stunden',
                            start: moment(latest).subtract(24, 'h').unix(),
                            end: moment(latest).unix()
                        }, {
                            name: 'Letzten 7 Tage',
                            start: moment(latest).subtract(7, 'd').unix(),
                            end: moment(latest).unix()
                        }, {
                            name: 'Letzter Monat',
                            start: moment(latest).subtract(30, 'd').unix(),
                            end: moment(latest).unix()
                        }, {
                            name: 'Letzten 3 Monate',
                            start: moment(latest).subtract(3, 'M').unix(),
                            end: moment(latest).unix()
                        }, {
                            name: 'Letztes Jahr',
                            start: moment(latest).subtract(1, 'y').unix(),
                            end: moment(latest).unix()
                        }, {
                            name: 'Seit Sendestart',
                            start: 1421276400,
                            end: moment(latest).unix()
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

                    return LiveDataSrv.loadRemote(start, end)
                        .then(function() {
                            var live = { Youtube: $scope.live['Youtube'] }; //TODO

                            var d = _.map(live, function(data, id) {
                                data = LiveDataSrv.filter(data, start, end);

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
                                    key: id,
                                    columns: { x: 'time', y: 'viewers' },
                                    values: values
                                };
                            });

                            return d;
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
