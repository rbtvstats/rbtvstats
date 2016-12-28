angular.module('app.common').directive('chartDateRange', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/common/chart/chart-date-range/chart-date-range.html',
        controller: function($scope, $timeout) {
            $scope.init = function() {
                $scope.date = {
                    start: null,
                    end: null
                };

                $scope.timePicker = {
                    show: false
                };

                $scope.datePicker = {
                    show: false
                };

                $scope.tab = {
                    selected: 'quickselect'
                };

                $scope.$watch('options.dateRange.selected', function(newVal, oldVal) {
                    var date = {};
                    if (angular.isObject($scope.options.dateRange.selected)) {
                        date = $scope.options.dateRange.selected;
                    }

                    $scope.date = $scope.date || {};
                    $scope.date.start = date.start;
                    $scope.date.end = date.end;
                }, true);

                $scope.$watch('date', function(newVal, oldVal) {
                    if (angular.isNumber($scope.date.start) && angular.isNumber($scope.date.end)) {
                        if ($scope.date.start > $scope.date.end) {
                            var start = $scope.date.start;
                            var end = $scope.date.end;
                            $scope.date.start = end;
                            $scope.date.end = start;
                        }
                    }
                }, true);

                $scope.$watch('tab.selected', function(newVal, oldVal) {
                    if (newVal === 'start' || newVal === 'end') {
                        $scope.timePicker.show = true;
                        $scope.datePicker.show = true;
                    } else {
                        $scope.timePicker.show = false;
                        $scope.datePicker.show = false;
                    }
                });
            };

            $scope.isSelectedRange = function(range) {
                return $scope.date.start === range.start && $scope.date.end === range.end;
            };

            $scope.setRange = function(range) {
                $scope.date.start = range.start;
                $scope.date.end = range.end;

                $scope.apply();
            };

            $scope.apply = function() {
                if (!angular.isObject($scope.options.dateRange.selected)) {
                    $scope.options.dateRange.selected = {};
                }

                $scope.options.dateRange.selected.start = $scope.date.start;
                $scope.options.dateRange.selected.end = $scope.date.end;
            };

            $scope.clear = function() {
                $scope.date.start = null;
                $scope.date.end = null;

                $scope.apply();
            };

            $scope.init();
        }
    };
});
