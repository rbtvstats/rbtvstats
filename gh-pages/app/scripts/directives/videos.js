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
                //parent scope
                $scope.imagePlaceholders = $scope.$parent.imagePlaceholders;
                $scope.channels = $scope.$parent.channels;
                $scope.shows = $scope.$parent.shows;
                $scope.hosts = $scope.$parent.hosts;
                $scope.assignArray = $scope.$parent.assignArray;
                $scope.listGroupShows = $scope.$parent.listGroupShows;

                //display/order/filter
                $scope.displayViewOptions = [
                    { value: 'list', name: 'Liste', icon: 'fa-th-list' },
                    { value: 'large', name: 'Kacheln', icon: 'fa-th-large' }
                ];
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
                $scope.filterMatchOptions = [
                    { value: 0, name: 'Und' },
                    { value: 1, name: 'Oder' }
                ];
                $scope.filterPublishedOptions = {
                    singleDatePicker: true
                };
                $scope.defaultOptions = {
                    display: {
                        view: $scope.displayViewOptions[1],
                        count: 25
                    },
                    order: {
                        column: $scope.orderByOptions[3],
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
                            match: $scope.filterMatchOptions[1]
                        },
                        hosts: {
                            filter: [],
                            match: $scope.filterMatchOptions[1]
                        },
                        length: {
                            start: 0,
                            end: 0
                        },
                        published: {
                            start: 0,
                            end: 0
                        },
                        event: 0,
                        other: 0
                    }
                };

                if (!($scope.tableParams instanceof NgTableParams)) {
                    $scope.tableParams = new NgTableParams({
                        sorting: {
                            published: 'desc'
                        },
                        count: 25,
                        filter: { $: 'a' }
                    }, {
                        dataset: $scope.data,
                        counts: [],
                        filterOptions: {
                            filterFn: $scope.applyFilter
                        }
                    });
                    $scope.tableParams.showOptions = false;
                    $scope.resetOptions();
                    $scope.filteredData = [];
                }

                $scope.$watchCollection('tableParams.options.display', function(newVal, oldVal) {
                    $scope.tableParams.count($scope.tableParams.options.display.count);
                });

                $scope.$watchCollection('tableParams.options.order', function(newVal, oldVal) {
                    $scope.tableParams.sorting($scope.tableParams.options.order.column.value, $scope.tableParams.options.order.type);
                });

                $scope.$watchCollection('tableParams.options.filter', function(newVal, oldVal) {

                });

                $scope.$watchCollection('data', function(newVal, oldVal) {
                    $scope.update();
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

            $scope.resetOptions = function() {
                $scope.tableParams.options = angular.copy($scope.defaultOptions);
            };

            $scope.getRatingPercent = function(video) {
                return Math.round(100 * video.stats.likeCount / (video.stats.likeCount + video.stats.dislikeCount));
            };

            $scope.addFilterChannel = function(channel) {
                if ($scope.tableParams.options.filter.channels.filter.indexOf(channel) === -1) {
                    $scope.tableParams.options.filter.channels.filter.push(channel);
                }
            };

            $scope.removeFilterChannel = function(channel) {
                var index = $scope.tableParams.options.filter.channels.filter.indexOf(channel);
                if (index > -1) {
                    $scope.tableParams.options.filter.channels.filter.splice(index, 1);
                }
            };

            $scope.addFilterShow = function(show) {
                if ($scope.tableParams.options.filter.shows.filter.indexOf(show) === -1) {
                    $scope.tableParams.options.filter.shows.filter.push(show);
                }
            };

            $scope.removeFilterShow = function(show) {
                var index = $scope.tableParams.options.filter.shows.filter.indexOf(show);
                if (index > -1) {
                    $scope.tableParams.options.filter.shows.filter.splice(index, 1);
                }
            };

            $scope.addFilterHost = function(host) {
                if ($scope.tableParams.options.filter.hosts.filter.indexOf(host) === -1) {
                    $scope.tableParams.options.filter.hosts.filter.push(host);
                }
            };

            $scope.removeFilterHost = function(host) {
                var index = $scope.tableParams.options.filter.hosts.filter.indexOf(host);
                if (index > -1) {
                    $scope.tableParams.options.filter.hosts.filter.splice(index, 1);
                }
            };

            $scope.scrollTop = function() {
                var top = angular.element(document.getElementById('top'));
                $document.scrollToElementAnimated(top);
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

            $scope.getVideoIds = function() {
                var ids = '';
                if ($scope.filteredData) {
                    for (var i = 0; i < $scope.filteredData.length; i++) {
                        if (i > 0) {
                            ids += ',';
                        }

                        ids += $scope.filteredData[i].id;
                    }
                }

                return ids;
            };

            $scope.applyFilter = function(data) {
                var filter = $scope.tableParams.options.filter;
                var videos = [];

                var containsOne = function(arr1, arr2) {
                    return arr2.some(function(v) {
                        return arr1.indexOf(v) >= 0;
                    });
                };

                var containsAll = function(arr1, arr2) {
                    return arr2.every(function(v) {
                        return arr1.indexOf(v) >= 0;
                    });
                };

                if (filter.title.text) {
                    if (filter.title.regex) {
                        var title = new RegExp(filter.title.text, filter.title.sensitive ? '' : 'i');
                    } else if (filter.title.sensitive) {
                        title = filter.title.text.toLowerCase();
                    } else {
                        title = filter.title.text;
                    }
                }

                for (var i = 0; i < data.length; i++) {
                    var match = true;
                    var video = data[i];

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

                        if (filter.shows.match.value === $scope.filterMatchOptions[0].value) {
                            match = containsAll(video.shows, filter.shows.filter);
                        } else if (filter.shows.match.value === $scope.filterMatchOptions[1].value) {
                            match = containsOne(video.shows, filter.shows.filter);
                        }
                    }

                    //hosts
                    if (match && filter.hosts.filter.length > 0) {
                        match = false;

                        if (filter.hosts.match.value === $scope.filterMatchOptions[0].value) {
                            match = containsAll(video.hosts, filter.hosts.filter);
                        } else if (filter.hosts.match.value === $scope.filterMatchOptions[1].value) {
                            match = containsOne(video.hosts, filter.hosts.filter);
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

                        match = video.published >= timestamp;
                    }

                    //event
                    if (match && filter.event == 1) {
                        match = false;

                        match = video.shows.join().indexOf('[E]') > -1;
                    } else if (match && filter.event == 2) {
                        match = false;

                        match = !(video.shows.join().indexOf('[E]') > -1);
                    }

                    //other
                    if (match && filter.other == 1) {
                        match = false;

                        match = video.shows.length === 0;
                    } else if (match && filter.other == 2) {
                        match = false;

                        match = video.shows.length > 0;
                    }

                    if (match) {
                        videos.push(video);
                    }
                }

                $scope.filteredData = videos;

                return videos;
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
