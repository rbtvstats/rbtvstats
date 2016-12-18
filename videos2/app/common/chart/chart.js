angular.module('app.common').directive('chart', function($q, $timeout) {
    var now = moment();

    return {
        restrict: 'A',
        scope: {
            options: '=options',
            update: '=update'
        },
        templateUrl: 'app/common/chart/chart.html',
        controller: function($scope, $rootScope, Notification) {

            function tickFormatAutoDate(d, axis) {
                var range;
                var min = [];
                var max = [];
                _.each($scope.data, function(data) {
                    min.push(data.values[0][axis]);
                    max.push(data.values[data.values.length - 1][axis]);
                });

                min = _.min(min);
                max = _.max(max);
                range = max - min;

                var format;
                if (range > 2628000) { //1 month
                    format = '%b %Y';
                } else if (range > 259200) { //3 days
                    format = '%x';
                } else {
                    format = '%H:%M';
                }

                return d3.time.format(format)(new Date(d * 1000));
            }

            var defaultCommon = {
                chart: {
                    minWidth: 800,
                    height: 400,
                    showLegend: true,
                    showControls: false,
                    useInteractiveGuideline: false,
                    x: function(d) {
                        return d.x;
                    },
                    y: function(d) {
                        return d.y;
                    },
                    xAxis: {
                        showMaxMin: false,
                        axisLabelDistance: 0,
                        tickFormat: function(d) {
                            if ($scope.options.chart.xAxis.tickFormatAutoDate) {
                                return tickFormatAutoDate(d, 'x');
                            } else if ($scope.options.dateGroup.enable) {
                                return _.find($scope.options.dateGroup.groups, function(group) {
                                    return group.id === $scope.options.dateGroup.selected;
                                }).format(d);
                            } else {
                                return d;
                            }
                        }
                    },
                    yAxis: {
                        showMaxMin: false,
                        axisLabelDistance: 5,
                        tickFormat: function(d) {
                            if ($scope.options.chart.yAxis.tickFormatAutoDate) {
                                return tickFormatAutoDate(d, 'y');
                            } else {
                                return d;
                            }
                        }
                    },
                    margin: {
                        top: 40,
                        right: 20,
                        bottom: 55,
                        left: 80
                    },
                    legend: {
                        align: true,
                        rightAlign: false,
                        margin: {
                            top: 10,
                            right: 20,
                            bottom: 5,
                            left: 20
                        }
                    },
                    tooltip: {
                        gravity: 'w',
                        distance: 15,
                        hideDelay: 200,
                        classes: 'chart-tooltip'
                    }
                },
                export: {
                    enable: true
                },
                dateGroup: {
                    enable: false,
                    selected: 'month',
                    groups: [{
                        id: 'week',
                        name: 'Woche',
                        format: function(d) {
                            return d3.time.format('%x')(new Date(d * 1000));
                        }
                    }, {
                        id: 'month',
                        name: 'Monat',
                        format: function(d) {
                            return d3.time.format('%b %Y')(new Date(d * 1000));
                        }
                    }, {
                        id: 'quarter',
                        name: 'Quartal',
                        format: function(d) {
                            return d3.time.format('%b %Y')(new Date(d * 1000));
                        }
                    }]
                },
                dateRange: {
                    enable: false,
                    selected: {
                        start: null,
                        end: null
                    },
                    ranges: [{
                        name: 'Letzten 7 Tage',
                        start: moment(now).subtract(7, 'd').unix(),
                        end: null
                    }, {
                        name: 'Letzter Monat',
                        start: moment(now).subtract(30, 'd').unix(),
                        end: null
                    }, {
                        name: 'Letzten 3 Monate',
                        start: moment(now).subtract(3, 'M').unix(),
                        end: null
                    }, {
                        name: 'Letztes Jahr',
                        start: moment(now).subtract(1, 'y').unix(),
                        end: null
                    }, {
                        name: 'Seit Sendestart',
                        start: 1421276400,
                        end: null
                    }]
                },
                styles: {
                    classes: {
                        'with-3d-shadow': true,
                        'with-transitions': true
                    }
                }
            };

            var defaultOptions = {
                lineChart: {
                    chart: {
                        type: 'lineChart'
                    }
                },
                multiBarChart: {
                    chart: {
                        type: 'multiBarChart',
                        stacked: true
                    }
                },
                pieChart: {
                    chart: {
                        minWidth: null,
                        type: 'pieChart',
                        labelType: 'percent',
                        labelsOutside: true,
                        x: function(d) {
                            return d.key;
                        }
                    }
                }
            };

            $scope.init = function() {
                $scope.error = false;
                $scope.loading = true;

                $scope.config = {
                    deepWatchOptions: false,
                    deepWatchDataDepth: 0
                };

                if (!angular.isObject($scope.options)) {
                    $scope.options = {};
                }

                if (!angular.isObject($scope.options.chart)) {
                    $scope.options.chart = {};
                }

                _.defaultsDeep($scope.options, defaultOptions[$scope.options.chart.type] || defaultOptions['lineChart'], defaultCommon);

                $scope.$watchGroup(['options.dateGroup.selected', 'options.dateRange.selected.start', 'options.dateRange.selected.end'], function(newVal, oldVal) {
                    $scope.update();
                });

                $scope.update();
            };

            $scope.updateData = $scope.update;

            $scope.update = _.debounce(function() {
                $rootScope.safeApply(function() {
                    $scope.error = false;
                    $scope.loading = true;
                    $scope.data = [];
                    $timeout(function() {
                        $q.when($scope.updateData())
                            .then(function(data) {
                                $scope.error = false;
                                $scope.loading = false;
                                if (angular.isArray(data)) {
                                    $scope.data = data;
                                } else {
                                    $scope.data = [data];
                                }
                            })
                            .catch(function(err) {
                                $scope.error = true;
                                $scope.loading = false;
                            });
                    }, 200);
                });
            }, 200);

            $scope.init();
        }
    };
});
