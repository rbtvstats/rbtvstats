angular.module('app.common').directive('chartExport', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/common/chart/chart-export/chart-export.html',
        link: function(scope, element, attrs, fn) {
            scope.chart = element.closest('.chart').find('nvd3').first();
        },
        controller: function($scope, Notification) {
            $scope.init = function() {
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
            };

            $scope.exportErrorWrapper = function(func) {
                return function() {
                    try {
                        func();
                    } catch (err) {
                        console.error(err);
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
                var svg = $scope.chart.children('svg')[0].cloneNode(true);

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
                var svg = $scope.chart.children('svg').first();
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

            $scope.init();
        }
    };
});
