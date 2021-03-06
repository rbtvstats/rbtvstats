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
                        count: 25,
                        page: 1
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

                if (!angular.isObject($scope.tableOptions) || angular.equals({}, $scope.tableOptions)) {
                    $scope.resetOptions();
                }
            };

            $scope.addFilterChannel = function(channel) {
                if ($scope.tableOptions.filter.channels.filter.indexOf(channel) === -1) {
                    $scope.tableOptions.filter.channels.filter.push(channel);
                }
            };

            $scope.removeFilterChannel = function(channel) {
                var index = $scope.tableOptions.filter.channels.filter.indexOf(channel);
                if (index > -1) {
                    $scope.tableOptions.filter.channels.filter.splice(index, 1);
                }
            };

            $scope.addFilterShow = function(show) {
                if ($scope.tableOptions.filter.shows.filter.indexOf(show) === -1) {
                    $scope.tableOptions.filter.shows.filter.push(show);
                }
            };

            $scope.removeFilterShow = function(show) {
                var index = $scope.tableOptions.filter.shows.filter.indexOf(show);
                if (index > -1) {
                    $scope.tableOptions.filter.shows.filter.splice(index, 1);
                }
            };

            $scope.addFilterHost = function(host) {
                if ($scope.tableOptions.filter.hosts.filter.indexOf(host) === -1) {
                    $scope.tableOptions.filter.hosts.filter.push(host);
                }
            };

            $scope.removeFilterHost = function(host) {
                var index = $scope.tableOptions.filter.hosts.filter.indexOf(host);
                if (index > -1) {
                    $scope.tableOptions.filter.hosts.filter.splice(index, 1);
                }
            };

            $scope.addFilterSeries = function(series) {
                if ($scope.tableOptions.filter.series.filter.indexOf(series) === -1) {
                    $scope.tableOptions.filter.series.filter.push(series);
                }
            };

            $scope.removeFilterSeries = function(series) {
                var index = $scope.tableOptions.filter.series.filter.indexOf(series);
                if (index > -1) {
                    $scope.tableOptions.filter.series.filter.splice(index, 1);
                }
            };

            $scope.resetOptions = function() {
                angular.copy($scope.defaultOptions, $scope.tableOptions);
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
