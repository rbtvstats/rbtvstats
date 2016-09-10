'use strict';

function binaryClosest(array, searchElement) {
    var minIndex = 0;
    var maxIndex = array.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = array[currentIndex].time;

        if (maxIndex - minIndex <= 1) {
            return currentIndex;
        } else if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        } else if (currentElement > searchElement) {
            maxIndex = currentIndex - 1;
        }
    }

    return -1; //should not happen
}

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:LiveCtrl
 * @description
 * # LiveCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('LiveCtrl', function($scope, $rootScope, $location, StateSrv, DataSrv) {
    $scope.init = function() {
        $scope.model = {};
        $scope.model.dataLatest = 0;
        $scope.model.dateRangeOptions = {
            showDropdowns: true,
            timePicker: true,
            timePicker24Hour: true,
            locale: {
                format: 'DD.MM.YYYY',
                separator: ' - ',
                applyLabel: 'Anwenden',
                cancelLabel: 'Abbrechen',
                fromLabel: 'Bis',
                toLabel: 'Von',
                customRangeLabel: 'Manuell',
                weekLabel: 'W',
                daysOfWeek: [
                    'So',
                    'Mo',
                    'Di',
                    'Mi',
                    'Do',
                    'Fr',
                    'Sa'
                ],
                monthNames: [
                    'Januar',
                    'Frebruar',
                    'März',
                    'April',
                    'Mai',
                    'Juni',
                    'Juli',
                    'August',
                    'September',
                    'Oktober',
                    'November',
                    'Dezember'
                ],
                'firstDay': 1
            },
            ranges: {}
        };
        $scope.model.dateRange = $scope.getDateRange();
        $scope.model.stats = {};

        $scope.model = StateSrv.load($location.path(), $scope.model);

        $scope.$on('updateData', function(event, args) {
            setTimeout(function() {
                $scope.update();
            }, 0);
        });

        $scope.$watch('model.dateRange', function(newVal, oldVal) {
            var param = {};

            if ($scope.model.dateRange.startDate) {
                param.from = $scope.model.dateRange.startDate.unix();
            }

            if ($scope.model.dateRange.endDate) {
                param.to = $scope.model.dateRange.endDate.unix();
            }

            $location.search(param);
            $scope.updateChart();
        }, true);

        $scope.$on("$routeUpdate", function(event, route) {
            var params = $location.search();
            var maxDate = moment($scope.live[$scope.live.length - 1].time);

            if (!params.from) {
                $scope.model.dateRange.startDate = moment(maxDate).subtract(24, 'h');
            } else {
                $scope.model.dateRange.startDate = moment().unix(params.from);
            }

            if ($scope.model.dateRange.endDate) {
                $scope.model.dateRange.endDate = moment(maxDate);
            } else {
                $scope.model.dateRange.endDate = moment().unix(params.from);
            }
        });

        setTimeout(function() {
            $scope.update();
        }, 0);
    };

    $scope.getDateRange = function() {
        var params = $location.search();
        var dateRange = {
            startDate: null,
            endDate: null
        };

        if (params.from) {
            dateRange.startDate = moment.unix(parseInt(params.from, 10));
        }

        if (params.to) {
            dateRange.endDate = moment.unix(parseInt(params.to, 10));
        }

        return dateRange;
    };

    $scope.update = function() {
        if ($scope.model.dataLatest != $scope.liveMetadata.time && $scope.liveMetadata.time > 0) {
            $scope.model.dataLatest = $scope.liveMetadata.time;

            $scope.updateDatePicker();
            $scope.updateStats();
            $scope.updateChart();

            $scope.$apply();
        }
    };

    $scope.updateDatePicker = function() {
        if ($scope.live.length > 0) {
            var minDate = moment($scope.live[0].time);
            var maxDate = moment($scope.live[$scope.live.length - 1].time);

            $scope.model.dateRangeOptions.minDate = minDate;
            $scope.model.dateRangeOptions.maxDate = maxDate;

            $scope.model.dateRangeOptions.ranges = {};

            var momentMax = moment(maxDate);
            var momentStart = moment(momentMax).subtract(8, 'h');
            $scope.model.dateRangeOptions.ranges['Letzten 8 Stunden'] = [momentStart, momentMax];

            momentStart = moment(momentMax).subtract(24, 'h');
            $scope.model.dateRangeOptions.ranges['Letzten 24 Stunden'] = [momentStart, momentMax];

            momentStart = moment(momentMax).subtract(7, 'd');
            $scope.model.dateRangeOptions.ranges['Letzten 7 Tage'] = [momentStart, momentMax];

            momentStart = moment(momentMax).subtract(1, 'M');
            $scope.model.dateRangeOptions.ranges['Letzter Monat'] = [momentStart, momentMax];

            momentStart = moment(momentMax).subtract(1, 'y');
            $scope.model.dateRangeOptions.ranges['Letztes Jahr'] = [momentStart, momentMax];

            if (!$scope.model.dateRange.startDate) {
                $scope.model.dateRange.startDate = moment(momentMax).subtract(24, 'h');
            }

            if (!$scope.model.dateRange.endDate) {
                $scope.model.dateRange.endDate = moment(momentMax);
            }
        }
    };

    $scope.updateStats = function() {
        $scope.model.stats = [];

        if ($scope.live.length > 0) {
            $scope.model.stats.push({
                title: 'Ältester Datenpunkt',
                value: {
                    type: 'text',
                    text: moment($scope.live[0].time).format('LLLL')
                }
            });

            $scope.model.stats.push({
                title: 'Neuster Datenpunkt',
                value: {
                    type: 'text',
                    text: moment($scope.live[$scope.live.length - 1].time).format('LLLL')
                }
            });

            $scope.model.stats.push({
                title: 'Anzahl gesamter Datenpunkte',
                value: {
                    type: 'number',
                    text: $scope.live.length
                }
            });

            $scope.model.stats.push({
                title: 'Ø Anzahl Datenpunkte pro Stunde',
                value: {
                    type: 'number',
                    text: Math.round($scope.live.length / (($scope.live[$scope.live.length - 1].time.getTime() - $scope.live[0].time.getTime()) / 3600000))
                }
            });
        }
    };

    $scope.updateChart = function() {
        var chart = {};

        if ($scope.live.length > 0) {
            chart.labels = [];
            chart.series = [];
            chart.data = [
                []
            ];
            chart.options = {
                type: 'line',
                header: 'Live Views',
                width: '100%',
                height: '430px',
                legend: {
                    display: false
                },
                elements: {
                    point: {
                        radius: 0,
                        hitRadius: 5
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        ticks: {
                            minRotation: 60,
                            maxRotation: 60
                        },
                        time: {
                            displayFormats: {
                                second: 'HH:mm',
                                minute: 'HH:mm',
                                hour: 'HH:mm',
                                day: 'DD.MM.YY',
                                week: 'DD.MM.YY',
                                month: 'DD.MM.YY',
                                quarter: 'DD.MM.YY',
                                year: 'DD.MM.YY',
                            }
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Views'
                        }
                    }]
                }
            };

            chart.series.push('Live Views');

            var startIndex = binaryClosest($scope.live, $scope.model.dateRange.startDate);
            var endIndex = binaryClosest($scope.live, $scope.model.dateRange.endDate);

            for (var i = startIndex; i <= endIndex; i++) {
                var data = $scope.live[i];
                chart.labels.push(moment(data.time).format('LLLL'));
                chart.data[0].push(data.viewers);
            }
        }

        $scope.model.chart = chart;
    };

    $scope.init();
});
