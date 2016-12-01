angular.module('app.editor').directive('videosOptions', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            options: '=videosOptions',
            table: '=videosTable'
        },
        templateUrl: 'app/editor/views/videos/videos-all/videos-options/videos-options.html',
        controller: function($scope, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
            $scope.init = function() {
                $scope.channels = ChannelsSrv.all();
                $scope.shows = ShowsSrv.all();
                $scope.hosts = HostsSrv.all();
                $scope.series = SeriesSrv.all();

                //import from parent scope
                $scope.imagePlaceholders = $scope.$parent.imagePlaceholders;

                //view
                $scope.displayViewOptions = [
                    { value: 'list', name: 'Liste', icon: 'fa-th-list' },
                    { value: 'large', name: 'Kacheln', icon: 'fa-th-large' }
                ];
                $scope.displayCountOptions = [10, 25, 50, 100];

                //order
                $scope.orderByOptions = [
                    { value: 'title', name: 'Titel' },
                    { value: 'channel', name: 'Kanal' },
                    { value: 'length', name: 'Laufzeit' },
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
                    { value: 0, name: 'Alle' },
                    { value: 1, name: 'Ja' },
                    { value: 2, name: 'Nein' }
                ];
                $scope.filterPublishedOptions = {
                    singleDatePicker: true
                };
                $scope.filterAiredOptions = {
                    singleDatePicker: true
                };

                //default options
                $scope.defaultOptions = {
                    display: {
                        view: 'large',
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
                        length: {
                            start: 0,
                            end: 0
                        },
                        published: {
                            start: 0,
                            end: 0
                        },
                        aired: {
                            start: 0,
                            end: 0
                        },
                        event: 0,
                        noShow: 0,
                        noHost: 0,
                        noSeries: 0,
                        online: 1,
                        valid: 1
                    }
                };

                $scope.$watchCollection('options.display', function(newVal, oldVal) {
                    $scope.table.count($scope.options.display.count);
                });

                $scope.$watchCollection('options.order', function(newVal, oldVal) {
                    $scope.table.sorting($scope.options.order.column, $scope.options.order.type);
                });

                if (!$scope.options) {
                    $scope.resetOptions();
                }
            };

            $scope.addFilterChannel = function(channel) {
                if ($scope.options.filter.channels.filter.indexOf(channel) === -1) {
                    $scope.options.filter.channels.filter.push(channel);
                }
            };

            $scope.removeFilterChannel = function(channel) {
                var index = $scope.options.filter.channels.filter.indexOf(channel);
                if (index > -1) {
                    $scope.options.filter.channels.filter.splice(index, 1);
                }
            };

            $scope.addFilterShow = function(show) {
                if ($scope.options.filter.shows.filter.indexOf(show) === -1) {
                    $scope.options.filter.shows.filter.push(show);
                }
            };

            $scope.removeFilterShow = function(show) {
                var index = $scope.options.filter.shows.filter.indexOf(show);
                if (index > -1) {
                    $scope.options.filter.shows.filter.splice(index, 1);
                }
            };

            $scope.addFilterHost = function(host) {
                if ($scope.options.filter.hosts.filter.indexOf(host) === -1) {
                    $scope.options.filter.hosts.filter.push(host);
                }
            };

            $scope.removeFilterHost = function(host) {
                var index = $scope.options.filter.hosts.filter.indexOf(host);
                if (index > -1) {
                    $scope.options.filter.hosts.filter.splice(index, 1);
                }
            };

            $scope.addFilterSeries = function(series) {
                if ($scope.options.filter.series.filter.indexOf(series) === -1) {
                    $scope.options.filter.series.filter.push(series);
                }
            };

            $scope.removeFilterSeries = function(series) {
                var index = $scope.options.filter.series.filter.indexOf(series);
                if (index > -1) {
                    $scope.options.filter.series.filter.splice(index, 1);
                }
            };

            $scope.resetOptions = function() {
                $scope.options = angular.copy($scope.defaultOptions);
            };

            $scope.applyFilter = function() {
                $timeout(function() {
                    $scope.table.reload();
                }, 100);
            };

            $scope.resetFilter = function() {
                $scope.resetOptions();
                $scope.applyFilter();
            };

            $scope.init();
        }
    };
});

angular.module('app.editor').service('VideosFilterSrv', function(VideosSrv) {
    var service = {};

    function containsOne(arr1, arr2) {
        return arr2.some(function(v) {
            return arr1.indexOf(v) >= 0;
        });
    }

    function containsAll(arr1, arr2) {
        return arr2.every(function(v) {
            return arr1.indexOf(v) >= 0;
        });
    }

    service.filter = function(videosIn, filter) {
        var videosOut = [];

        if (filter.title.text) {
            if (filter.title.regex) {
                var title = new RegExp(filter.title.text, filter.title.sensitive ? '' : 'i');
            } else if (filter.title.sensitive) {
                title = filter.title.text.toLowerCase();
            } else {
                title = filter.title.text;
            }
        }

        for (var i = 0; i < videosIn.length; i++) {
            var match = true;
            var video = videosIn[i];

            //title
            if (match && title) {
                match = false;

                if (filter.title.regex) {
                    match = title.exec(video.title) !== null;
                } else if (filter.title.sensitive) {
                    match = video.title.indexOf(title) > -1;
                } else {
                    match = video.title.toLowerCase().indexOf(title) > -1;
                }
            }

            //channels
            if (match && filter.channels.filter.length > 0) {
                match = false;

                match = containsOne([video.channel], filter.channels.filter);
            }

            //shows
            if (match && filter.shows.filter.length > 0) {
                match = false;

                if (filter.shows.match.value === 'and') {
                    match = containsAll(video.shows, filter.shows.filter);
                } else if (filter.shows.match.value === 'or') {
                    match = containsOne(video.shows, filter.shows.filter);
                }
            }

            //hosts
            if (match && filter.hosts.filter.length > 0) {
                match = false;

                if (filter.hosts.match.value === 'and') {
                    match = containsAll(video.hosts, filter.hosts.filter);
                } else if (filter.hosts.match.value === 'or') {
                    match = containsOne(video.hosts, filter.hosts.filter);
                }
            }

            //series
            if (match && filter.series.filter.length > 0) {
                match = false;

                if (filter.series.match.value === 'and') {
                    match = containsAll(video.series, filter.series.filter);
                } else if (filter.series.match.value === 'or') {
                    match = containsOne(video.series, filter.series.filter);
                }
            }

            //length
            if (match && filter.length.start) {
                match = false;
                var length = filter.length.start.getHours() * 3600 + filter.length.start.getMinutes() * 60;

                match = video.length >= length;
            }

            if (match && filter.length.end) {
                match = false;
                var length = filter.length.end.getHours() * 3600 + filter.length.end.getMinutes() * 60;

                match = video.length <= length;
            }

            //published
            if (match && filter.published.start) {
                match = false;
                var timestamp = filter.published.start.unix();

                match = video.published >= timestamp;
            }

            if (match && filter.published.end) {
                match = false;
                var timestamp = filter.published.end.unix();

                match = video.published <= timestamp;
            }

            //aired
            if (match && filter.aired.start) {
                match = false;
                var timestamp = filter.aired.start.unix();

                match = video.aired >= timestamp;
            }

            if (match && filter.aired.end) {
                match = false;
                var timestamp = filter.aired.end.unix();

                match = video.aired <= timestamp;
            }

            //event
            if (match && filter.event === 1) {
                match = false;

                match = video.shows.join().indexOf('[E]') > -1;
            } else if (match && filter.event === 2) {
                match = false;

                match = !(video.shows.join().indexOf('[E]') > -1);
            }

            //noShow
            if (match && filter.noShow === 1) {
                match = false;

                match = video.shows.length === 0;
            } else if (match && filter.noShow === 2) {
                match = false;

                match = video.shows.length > 0;
            }

            //noHost
            if (match && filter.noHost === 1) {
                match = false;

                match = video.hosts.length === 0;
            } else if (match && filter.noHost === 2) {
                match = false;

                match = video.hosts.length > 0;
            }

            //noSeries
            if (match && filter.noSeries === 1) {
                match = false;

                match = video.series.length === 0;
            } else if (match && filter.noSeries === 2) {
                match = false;

                match = video.series.length > 0;
            }

            //online
            if (match && filter.online === 1) {
                match = false;

                match = video.online;
            } else if (match && filter.online === 2) {
                match = false;

                match = !video.online;
            }

            //valid
            if (match && filter.valid === 1) {
                match = false;

                match = VideosSrv.isValid(video);
            } else if (match && filter.valid === 2) {
                match = false;

                match = !VideosSrv.isValid(video);
            }

            if (match) {
                videosOut.push(video);
            }
        }

        return videosOut;
    };

    return service;
});
