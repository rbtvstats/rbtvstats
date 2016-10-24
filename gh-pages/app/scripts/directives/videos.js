'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:videos
 * @description
 * # videos
 */
app.directive('videos', function($rootScope, uuid4, FlagSrv) {
    return {
        templateUrl: 'views/template-videos.html',
        restrict: 'A',
        scope: {
            data: '=videos',
            tableParams: '=params'
        },
        controller: function($scope, $rootScope, $timeout, $filter, $document, $uibModal, NgTableParams) {
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

            $scope.getLiveFrom = function(video) {
                if (video.aired) {
                    var date = new Date(video.aired * 1000);
                    date.setHours(0, 0, 0);

                    return date.getTime() / 1000;
                }
            };

            $scope.getLiveTo = function(video) {
                if (video.aired) {
                    var date = new Date(video.aired * 1000);
                    date.setHours(23, 59, 59);

                    return date.getTime() / 1000;
                }
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

            $scope.openFlagDialog = function(videoId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'views/template-flag.html',
                    controller: 'FlagCtrl'
                });

                modalInstance.result.then(function(reasons) {
                    var data = {
                        videoId: videoId,
                        reasons: reasons
                    };

                    FlagSrv.flag(data).then(function() {
                            $rootScope.addAlert({
                                type: 'success',
                                msg: 'Video erfolgreich gemeldet. Danke!'
                            });
                        },
                        function(error) {
                            $rootScope.addAlert({
                                type: 'danger',
                                msg: 'Ein Fehler ist beim Melden des Videos aufgetreten. (status: ' + error.status + ')'
                            });
                        });
                }, function() {
                    //ignore
                });
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
