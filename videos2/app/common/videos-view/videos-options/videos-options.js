angular.module('app.common').directive('videosOptions', function($timeout, $parse) {
    return {
        restrict: 'A',
        templateUrl: 'app/common/videos-view/videos-options/videos-options.html',
        controller: function($scope, ngTableEventsChannel, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
            $scope.init = function() {
                $scope.channels = ChannelsSrv.all();
                $scope.shows = ShowsSrv.all();
                $scope.hosts = HostsSrv.all();
                $scope.series = SeriesSrv.all();

                //view
                $scope.displayViewOptions = [
                    { value: 'list', name: 'Liste', icon: 'fa-th-list' },
                    { value: 'card', name: 'Kacheln', icon: 'fa-th-large' }
                ];
                $scope.displayCountOptions = [25, 50, 100];

                //order
                $scope.orderByOptions = [
                    { value: 'title', name: 'Titel' },
                    { value: 'channel', name: 'Kanal' },
                    { value: 'duration', name: 'Laufzeit' },
                    { value: 'published', name: 'Veröffentlicht' },
                    { value: 'aired', name: 'Ausgestrahlt' },
                    { value: 'stats.viewCount', name: 'Views' },
                    { value: 'stats.likeCount', name: 'Likes' },
                    { value: 'stats.dislikeCount', name: 'Dislikes' },
                    { value: 'stats.commentCount', name: 'Kommentare' }
                ];
                $scope.orderTypeOptions = [
                    { value: 'asc', name: 'Aufsteigend' },
                    { value: 'desc', name: 'Absteigend' }
                ];

                //filter
                $scope.filterMatchOptions = [
                    { value: 'and', name: 'Und' },
                    { value: 'or', name: 'Oder' }
                ];
                $scope.filterSelectionOptions = [
                    { value: -1, name: 'Egal' },
                    { value: true, name: 'Ja' },
                    { value: false, name: 'Nein' }
                ];

                //default options
                $scope.defaultOptions = {
                    display: {
                        view: 'card',
                        count: 25
                    },
                    order: {
                        column: 'published',
                        type: 'desc'
                    },
                    filter: {
                        title: {
                            text: null,
                            regex: false,
                            sensitive: false
                        },
                        channels: {
                            filter: []
                        },
                        shows: {
                            filter: [],
                            match: 'or'
                        },
                        hosts: {
                            filter: [],
                            match: 'or'
                        },
                        series: {
                            filter: [],
                            match: 'or'
                        },
                        duration: {
                            start: null,
                            end: null
                        },
                        published: {
                            start: null,
                            end: null
                        },
                        aired: {
                            start: null,
                            end: null
                        },
                        event: -1,
                        noShow: -1,
                        noHost: -1,
                        noSeries: -1,
                        online: true,
                        valid: -1,
                        invert: false
                    }
                };

                $scope.aired = {
                    start: {},
                    end: {}
                };

                //sync: table.options -> table.params
                $scope.$watchCollection('table.options.order', function(newVal, oldVal) {
                    $scope.table.params.sorting($scope.table.options.order.column, $scope.table.options.order.type);
                });

                $scope.$watch('table.options.display.count', function(newVal, oldVal) {
                    $scope.table.params.count($scope.table.options.display.count);
                });

                //sync: table.params -> table.options
                $scope.$watch('table.params.sorting()', function(newVal, oldVal) {
                    var sorting = $scope.table.params.sorting();
                    for (var column in sorting) {
                        $scope.table.options.order.column = column;
                        $scope.table.options.order.type = sorting[column];
                        break;
                    }
                });

                $scope.$watch('table.params.count()', function(newVal, oldVal) {
                    $scope.table.options.display.count = $scope.table.params.count();
                });

                //clear videos cache on change
                $scope.$watch('table.options.filter', function(newVal, oldVal) {
                    $scope.clearVideosCache();
                }, true);

                if (angular.equals({}, $scope.table.options)) {
                    $scope.resetOptions();
                }
            };

            $scope.addFilterChannel = function(channel) {
                if ($scope.table.options.filter.channels.filter.indexOf(channel) === -1) {
                    $scope.table.options.filter.channels.filter.push(channel);
                }
            };

            $scope.removeFilterChannel = function(channel) {
                var index = $scope.table.options.filter.channels.filter.indexOf(channel);
                if (index > -1) {
                    $scope.table.options.filter.channels.filter.splice(index, 1);
                }
            };

            $scope.addFilterShow = function(show) {
                if ($scope.table.options.filter.shows.filter.indexOf(show) === -1) {
                    $scope.table.options.filter.shows.filter.push(show);
                }
            };

            $scope.removeFilterShow = function(show) {
                var index = $scope.table.options.filter.shows.filter.indexOf(show);
                if (index > -1) {
                    $scope.table.options.filter.shows.filter.splice(index, 1);
                }
            };

            $scope.addFilterHost = function(host) {
                if ($scope.table.options.filter.hosts.filter.indexOf(host) === -1) {
                    $scope.table.options.filter.hosts.filter.push(host);
                }
            };

            $scope.removeFilterHost = function(host) {
                var index = $scope.table.options.filter.hosts.filter.indexOf(host);
                if (index > -1) {
                    $scope.table.options.filter.hosts.filter.splice(index, 1);
                }
            };

            $scope.addFilterSeries = function(series) {
                if ($scope.table.options.filter.series.filter.indexOf(series) === -1) {
                    $scope.table.options.filter.series.filter.push(series);
                }
            };

            $scope.removeFilterSeries = function(series) {
                var index = $scope.table.options.filter.series.filter.indexOf(series);
                if (index > -1) {
                    $scope.table.options.filter.series.filter.splice(index, 1);
                }
            };

            $scope.resetOptions = function() {
                angular.copy($scope.defaultOptions, $scope.table.options);
            };

            $scope.applyFilter = function() {
                $scope.update();
            };

            $scope.resetFilter = function() {
                $scope.clearVideosCache();
                $scope.resetOptions();
                $scope.applyFilter();
            };

            $scope.init();
        }
    };
});
