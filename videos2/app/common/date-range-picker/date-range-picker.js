angular.module('app.common').directive('dateRangePicker', function() {
    return {
        restrict: 'A',
        scope: {
            dateTarget: '=dateRangePicker',
            options: '=options'
        },
        templateUrl: 'app/common/date-range-picker/date-range-picker.html',
        controller: function($scope, $timeout) {
            $scope.init = function() {
                var defaultOptions = {
                    ranges: [],
                    min: undefined,
                    max: undefined
                };

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

                if (!angular.isObject($scope.options)) {
                    $scope.options = {};
                }

                _.defaultsDeep($scope.options, defaultOptions);

                $scope.$watch('dateTarget', function(newVal, oldVal) {
                    var date = {};
                    if (angular.isObject($scope.dateTarget)) {
                        date = $scope.dateTarget;
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
                if (!angular.isObject($scope.dateTarget)) {
                    $scope.dateTarget = {};
                }

                $scope.dateTarget.start = $scope.date.start;
                $scope.dateTarget.end = $scope.date.end;
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
