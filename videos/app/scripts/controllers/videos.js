'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:VideosCtrl
 * @description
 * # VideosCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('VideosCtrl', function($scope, $filter, $q, NgTableParams, StateSrv, VideosDataSrv, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
    $scope.init = function() {
        $scope.videos = VideosSrv.all();
        $scope.channels = ChannelsSrv.all();
        $scope.shows = ShowsSrv.all();
        $scope.hosts = HostsSrv.all();
        $scope.series = SeriesSrv.all();

        $scope.updateState = {
            active: false,
            info: null,
            latest: null
        };

        //update until
        $scope.updateUntilOptions = {
            singleDatePicker: true
        };
        $scope.updateUntil = new Date(2015, 0, 15);

        //display/order/filter options
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
        $scope.defaultOptions = {
            display: {
                count: 25
            },
            order: {
                column: $scope.orderByOptions[3].value,
                type: $scope.orderTypeOptions[1].value
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
                    match: $scope.filterMatchOptions[1].value
                },
                hosts: {
                    filter: [],
                    match: $scope.filterMatchOptions[1].value
                },
                series: {
                    filter: [],
                    match: $scope.filterMatchOptions[1].value
                },
                length: {
                    start: 0,
                    end: 0
                },
                published: {
                    start: 0,
                    end: 0
                },
                event: $scope.filterSelectionOptions[0].value,
                noShow: $scope.filterSelectionOptions[0].value,
                noHost: $scope.filterSelectionOptions[0].value,
                noSeries: $scope.filterSelectionOptions[0].value,
                online: $scope.filterSelectionOptions[1].value,
                valid: $scope.filterSelectionOptions[1].value
            }
        };

        //table options
        $scope.tableParams = new NgTableParams({
            filter: { $: 'a' }
        }, {
            dataset: $scope.videos,
            counts: [],
            filterOptions: {
                filterFn: $scope.applyFilter
            }
        });

        $scope.tableOptionsVisible = false;
        $scope.resetOptions();

        $scope.videosFiltered = [];
        $scope.clipboard = null;

        $scope.$watchCollection('tableOptions.display', function(newVal, oldVal) {
            $scope.tableParams.count($scope.tableOptions.display.count);
        });

        $scope.$watchCollection('tableOptions.order', function(newVal, oldVal) {
            $scope.tableParams.sorting($scope.tableOptions.order.column, $scope.tableOptions.order.type);
        });

        StateSrv.watch($scope, ['updateUntil', 'tableOptions']);
    };

    $scope.resetOptions = function() {
        $scope.tableOptions = angular.copy($scope.defaultOptions);
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

    $scope.applyFilter = function(data) {
        var filter = $scope.tableOptions.filter;
        var videos = [];

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

            //series
            if (match && filter.series.filter.length > 0) {
                match = false;

                if (filter.series.match.value === $scope.filterMatchOptions[0].value) {
                    match = containsAll(video.series, filter.series.filter);
                } else if (filter.series.match.value === $scope.filterMatchOptions[1].value) {
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

            //event
            if (match && filter.event === $scope.filterSelectionOptions[1].value) {
                match = false;

                match = video.shows.join().indexOf('[E]') > -1;
            } else if (match && filter.event === $scope.filterSelectionOptions[2].value) {
                match = false;

                match = !(video.shows.join().indexOf('[E]') > -1);
            }

            //noShow
            if (match && filter.noShow === $scope.filterSelectionOptions[1].value) {
                match = false;

                match = video.shows.length === 0;
            } else if (match && filter.noShow === $scope.filterSelectionOptions[2].value) {
                match = false;

                match = video.shows.length > 0;
            }

            //noHost
            if (match && filter.noHost === $scope.filterSelectionOptions[1].value) {
                match = false;

                match = video.hosts.length === 0;
            } else if (match && filter.noHost === $scope.filterSelectionOptions[2].value) {
                match = false;

                match = video.hosts.length > 0;
            }

            //noSeries
            if (match && filter.noSeries === $scope.filterSelectionOptions[1].value) {
                match = false;

                match = video.series.length === 0;
            } else if (match && filter.noSeries === $scope.filterSelectionOptions[2].value) {
                match = false;

                match = video.series.length > 0;
            }

            //online
            if (match && filter.online === $scope.filterSelectionOptions[1].value) {
                match = false;

                match = video.online;
            } else if (match && filter.online === $scope.filterSelectionOptions[2].value) {
                match = false;

                match = !video.online;
            }

            //valid
            if (match && filter.valid === $scope.filterSelectionOptions[1].value) {
                match = false;

                match = VideosSrv.isValid(video);
            } else if (match && filter.valid === $scope.filterSelectionOptions[2].value) {
                match = false;

                match = !VideosSrv.isValid(video);
            }

            if (match) {
                videos.push(video);
            }
        }

        $scope.videosFiltered = videos;

        return videos;
    };

    $scope.updateVideos = function(channels, untilCallback) {
        return $q(function(resolve, reject) {
            channels = channels.slice();

            $scope.updateState.active = true;

            function progressCallback(video) {
                $scope.updateState.latest = video;
            }

            function update(channels) {
                var channel = channels.pop();
                var until = untilCallback(channel);

                $scope.updateState.info = 'Lade Videos für Kanal \'' + channel.title + '\'';

                //fetch videos of channel
                return VideosDataSrv.fetchVideos(channel, until, progressCallback)
                    .then(function() {
                        //continue?
                        if (channels.length > 0) {
                            return update(channels);
                        }
                    });
            };

            update(channels)
                .then(function() {
                    $scope.updateState.active = false;
                    $scope.updateState.info = null;

                    VideosSrv.save();

                    resolve();
                })
                .catch(function(err) {
                    $scope.updateState.active = false;
                    $scope.updateState.info = null;

                    VideosSrv.save();

                    reject(err);
                });
        });
    };

    $scope.updateVideoDetails = function(videos) {
        return $q(function(resolve, reject) {
            $scope.updateState.active = true;
            $scope.updateState.info = 'Lade Video Details';

            function progressCallback(video) {
                $scope.updateState.latest = video;
            }

            VideosDataSrv.fetchVideoDetails(videos, progressCallback)
                .then(function() {
                    $scope.updateState.active = false;
                    $scope.updateState.info = null;

                    VideosSrv.save();

                    resolve();
                })
                .catch(function(err) {
                    $scope.updateState.active = false;
                    $scope.updateState.info = null;

                    VideosSrv.save();

                    reject(err);
                });
        });
    };

    $scope.updateVideosAll = function() {
        function until(channel) {
            return new Date(1970, 0, 1);
        };

        $scope.updateVideos($scope.channels, until)
            .then(function() {
                VideosSrv.save();
            })
            .catch(function(err) {
                console.error('error:', err);
                VideosSrv.save();
            });
    };

    $scope.updateVideosNew = function() {
        function until(channel) {
            var videos = VideosSrv.find(function(video) {
                return video.channel === channel.id && video.published > 0;
            });
            videos = $filter('orderBy')(videos, 'published', true);

            if (videos.length > 0) {
                return new Date(videos[0].published * 1000);
            }

            return new Date(2015, 0, 15);
        };

        $scope.updateVideos($scope.channels, until);
    };

    $scope.updateVideosAllUntil = function(date) {
        date = date.toDate();

        function until(channel) {
            return date;
        };

        $scope.updateVideos($scope.channels, until);
    };

    $scope.updateVideoDetailsAll = function() {
        var videos = $scope.videos;

        $scope.updateVideoDetails(videos);
    };

    $scope.updateVideoDetailsNew = function() {
        var videos = VideosSrv.find({ online: false });

        $scope.updateVideoDetails(videos);
    };

    $scope.updateVideoDetailsFiltered = function() {
        var videos = $scope.videosFiltered;

        $scope.updateVideoDetails(videos);
    };

    $scope.update = function() {
        $scope.tableParams.reload();
    };

    $scope.init();
});
