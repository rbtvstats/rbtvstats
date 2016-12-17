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
            $scope.init = function() {
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

                $scope.error = false;
                $scope.loading = true;
                $scope.exportChart = [{
                    name: 'SVG',
                    exec: $scope.exportErrorWrapper($scope.exportChartSVG)
                }, {
                    name: 'PNG',
                    exec: $scope.exportErrorWrapper($scope.exportChartPNG)
                }];
                $scope.exportData = [{
                    name: 'CSV',
                    exec: $scope.exportErrorWrapper($scope.exportDataCSV)
                }, {
                    name: 'JSON',
                    exec: $scope.exportErrorWrapper($scope.exportDataJSON)
                }];

                $scope.svgId = 'chart_' + $scope.$id;

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

                benchmark(function() {
                    $scope.updateData();
                }, false);

                $scope.update();
            };

            $scope.exportErrorWrapper = function(func) {
                return function() {
                    try {
                        func();
                    } catch (err) {
                        Notification.error({
                            title: 'Fehler beim Export',
                            message: 'Dein Browser unterstützt ggf. nicht die notwendigen Vorroussetzungen um die Datei zu Speichern',
                            delay: null
                        });
                    }
                };
            };

            $scope.exportDataCSV = function() {
                var args = _.map($scope.data, function(data) {
                    return data.values;
                });

                //values
                args.push(function() {
                    var y = _.map(arguments, function(value) {
                        return $scope.options.chart.y(value);
                    });

                    return _.concat([$scope.options.chart.x(arguments[0])], y);
                });

                var values = _.zipWith.apply(_, args);

                //header
                var header = _.map($scope.data, function(data) {
                    return data.key;
                });

                //export
                var data = _.concat([header], values);

                var dataStr = ',';
                _.each(data, function(data) {
                    dataStr += _.join(data, ',') + '\n';
                });

                var blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' });
                saveAs(blob, 'data.csv');
            };

            $scope.exportDataJSON = function() {
                var data = _.map($scope.data, function(data) {
                    var values = _.map(data.values, function(data) {
                        return {
                            x: $scope.options.chart.x(data),
                            y: $scope.options.chart.y(data)
                        };
                    });

                    return {
                        key: data.key,
                        values: values
                    };
                });

                var dataStr = angular.toJson(data, true);

                var blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
                saveAs(blob, 'data.json');
            };

            //see: https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
            $scope.exportChartSVG = function() {
                var svg = $('#' + $scope.svgId + ' > svg')[0].cloneNode(true);

                //extract the used style classes in the SVG from css files
                var styles = '';
                var sheets = document.styleSheets;
                for (var i = 0; i < sheets.length; i++) {
                    var rules = sheets[i].cssRules;
                    for (var j = 0; j < rules.length; j++) {
                        var rule = rules[j];
                        if (!angular.isUndefined(rule.style)) {
                            try {
                                var elems = svg.querySelectorAll(rule.selectorText);
                                if (elems.length > 0) {
                                    styles += rule.selectorText + ' { ' + rule.style.cssText + ' }\n';
                                }
                            } catch (e) {

                            }
                        }
                    }
                }

                //append styles to svg
                var s = document.createElement('style');
                s.setAttribute('type', 'text/css');
                s.innerHTML = '<![CDATA[\n' + styles + '\n]]>';

                var defs = document.createElement('defs');
                defs.appendChild(s);
                svg.insertBefore(defs, svg.firstChild);

                //set proper XML namespace
                svg.setAttribute('version', '1.1');
                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

                //create proper SVG XML
                var dataStr = '';
                dataStr += '<?xml version="1.0" standalone="no"?>';
                dataStr += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
                dataStr += svg.outerHTML;

                var blob = new Blob([dataStr], { type: 'text/plain' });
                saveAs(blob, 'data.svg');
            };

            $scope.exportChartPNG = function() {
                $scope.convertChartToBlob('image/png', function(blob) {
                    saveAs(blob, 'chart.png');
                });
            };

            $scope.convertChartToBlob = function(type, callback) {
                var svg = $('#' + $scope.svgId + ' > svg');
                var data = svg[0].outerHTML;

                svg.parent().after($('<canvas id="tmpCanvas" width="1" height="1"></canvas>'));
                var canvas = $('#tmpCanvas')[0];

                try {
                    canvg(canvas, data);
                    canvas.toBlob(callback, type, 1);
                } catch (e) {
                    throw e;
                } finally {
                    $(canvas).remove();
                }
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
