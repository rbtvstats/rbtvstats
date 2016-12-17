angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.live', {
        url: '/live/',
        templateUrl: 'app/viewer/live/live.html',
        controller: function($scope, LiveDataSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['live-metadata'];

            $scope.init = function() {
                $scope.live = LiveDataSrv.all();

                $scope.chart = $scope.chartVideosCount();
            };

            $scope.chartVideosCount = function() {
                var metadata = LiveDataSrv.metadata();
                var latest = _.maxBy(metadata.files, function(file) {
                    return file.end;
                });
                latest = moment.unix(latest.end);

                var dateFormat = '%x';
                var options = {
                    chart: {
                        type: 'stackedAreaChart',
                        interpolate: 'linear',
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
                        }
                    },
                    dateRange: {
                        enable: true,
                        selected: {
                            start: moment(latest).subtract(24, 'h').unix(),
                            end: null
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
        }
    });
});
