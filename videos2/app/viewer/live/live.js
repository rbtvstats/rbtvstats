angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.live', {
        url: '/live/',
        templateUrl: 'app/viewer/live/live.html',
        controller: function($scope, LiveDataControllerSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['metadata-live'];

            $scope.init = function() {
                $scope.live = LiveDataControllerSrv.all();
                $scope.chart = $scope.chartVideosCount();
            };

            $scope.chartVideosCount = function() {
                var dateFormat = '%x';
                var options = {
                    chart: {
                        type: 'lineChart',
                        xAxis: {
                            axisLabel: 'Datum',
                            tickFormat: function(d) {
                                return d3.time.format(dateFormat)(new Date(d * 1000));
                            }
                        },
                        yAxis: {
                            axisLabel: 'Live Zuschauer'
                        }
                    },
                    dateRange: {
                        enable: true
                    },
                    title: {
                        enable: true,
                        text: 'Live Zuschauer'
                    }
                };

                function update() {
                    var start = options.dateRange.selected.start;
                    var end = options.dateRange.selected.end;

                    return LiveDataControllerSrv.loadRemote(start, end)
                        .then(function() {
                            var data = LiveDataControllerSrv.filter($scope.live, start, end);

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
