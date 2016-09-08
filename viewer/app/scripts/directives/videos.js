'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:videos
 * @description
 * # videos
 */
app.directive('videos', function() {
    return {
        templateUrl: 'views/template-videos.html',
        restrict: 'A',
        scope: {
            data: '=videos',
            tableParams: '=params'
        },
        controller: function($scope, $rootScope, $timeout, $filter, $document, NgTableParams) {
            $scope.init = function() {
                if (!($scope.tableParams instanceof NgTableParams)) {
                    $scope.tableParams = new NgTableParams({
                        sorting: {
                            published: 'desc'
                        },
                        count: 25
                    }, {
                        dataset: $scope.data,
                        filterOptions: {
                            filterFn: $scope.customFilter
                        }
                    });
                }

                $scope.$watchCollection('data', function(newVal, oldVal) {
                    if (newVal.length != oldVal.length) {
                        $scope.update();
                    }
                });
            };

            $scope.scrollTop = function() {
                var top = angular.element(document.getElementById('top'));
                $document.scrollToElementAnimated(top);
            };

            //HACK: filter only 'channel' property by EXACT match!
            $scope.customFilter = function(data, parsedFilter, comparator) {
                var filteredData = data;
                var filterFn = $filter('filter');

                for (var key in parsedFilter) {
                    var comp = (key == 'channel') || comparator;
                    var filter = {};
                    filter[key] = parsedFilter[key];
                    filteredData = filterFn(filteredData, filter, comp);
                }

                return filteredData;
            }

            $scope.getSelectFilter = function(property) {
                var filter = [];

                function compare(a, b) {
                    if (a.title < b.title)
                        return -1;
                    else if (a.title > b.title)
                        return 1;
                    else
                        return 0;
                }

                var updateFilter = function() {
                    if ($.isArray($scope.data)) {
                        var allIds = [];
                        filter.length = 0;
                        for (var i = 0; i < $scope.data.length; i++) {
                            var video = $scope.data[i];
                            var id = video[property];
                            if (allIds.indexOf(id) == -1) {
                                allIds.push(id);
                                filter.push({
                                    id: id,
                                    title: id
                                });
                            }
                        }

                        filter.push({
                            id: '',
                            title: ''
                        });

                        filter.sort(compare);
                    }
                }

                $scope.$watchCollection('data', function(newVal, oldVal) {
                    if (newVal.length != oldVal.length) {
                        updateFilter();
                    }
                });

                updateFilter();

                return filter;
            };

            $scope.update = function() {
                $scope.tableParams.reload();
            };

            $scope.init();
        },
        link: function postLink(scope, element, attrs) {

        }
    };
});
