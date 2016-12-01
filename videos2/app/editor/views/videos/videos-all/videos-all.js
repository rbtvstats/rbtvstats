angular.module('app.editor').controller('VideosAllCtrl', function($scope, $filter, $q, NgTableParams, StateSrv, YoutubeApiSrv, VideosFilterSrv, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
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
        $scope.updateUntil = moment(new Date(2015, 0, 15));

        //table
        $scope.tableParams = new NgTableParams({
            filter: { $: 'a' }
        }, {
            dataset: $scope.videos,
            counts: [],
            filterOptions: {
                filterFn: function(videos) {
                    if (!$scope.videosCache) {
                        $scope.videosCache = VideosFilterSrv.filter(videos, $scope.tableOptions.filter);
                    }

                    return $scope.videosCache;
                }
            }
        });

        $scope.tableOptions = null;
        $scope.tableOptionsVisible = false;

        $scope.videosFiltered = [];
        $scope.clipboard = null;

        $scope.$watch('tableOptions.filter', function(newVal, oldVal) {
            $scope.clearVideosCache();
        }, true);

        $scope.videoChangedListener(function(video) {
            $scope.clearVideosCache();
        });

        StateSrv.watch($scope, ['tableOptions']);
    };

    function YTDurationToSeconds(duration) {
        var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

        var hours = (parseInt(match[1]) || 0);
        var minutes = (parseInt(match[2]) || 0);
        var seconds = (parseInt(match[3]) || 0);

        return hours * 3600 + minutes * 60 + seconds;
    }

    function fetchVideos(channel, until, progressCallback) {
        if (typeof(progressCallback) !== 'function') {
            progressCallback = function() {};
        }

        return $q(function(resolve, reject) {
            function fetch(page) {
                //fetch playlist items
                return YoutubeApiSrv.playlistItems(channel.playlistId, page)
                    .then(function(data) {
                        var nextPage = data.nextPageToken;
                        var items = data.items;

                        //save video info
                        items = $filter('orderBy')(items, 'snippet.publishedAt', true);
                        for (var i = 0; i < items.length; i++) {
                            var snippet = items[i].snippet;

                            var videoId = snippet.resourceId.videoId;
                            var video = VideosSrv.findById(videoId);
                            if (!video) {
                                video = VideosSrv.create({ id: videoId })
                            }

                            video.id = snippet.resourceId.videoId;
                            video.title = snippet.title;
                            video.published = (new Date(snippet.publishedAt).getTime()) / 1000;
                            video.channel = channel.id;

                            progressCallback(video);
                        }

                        var earliestVideo = items[items.length - 1];
                        var published = new Date(earliestVideo.snippet.publishedAt);
                        //continue?
                        if (nextPage && published >= until) {
                            return fetch(nextPage);
                        }
                    });
            };

            fetch()
                .then(resolve)
                .catch(reject);
        });
    };

    function fetchVideoDetails(videos, progressCallback) {
        if (typeof(progressCallback) !== 'function') {
            progressCallback = function() {};
        }

        return $q(function(resolve, reject) {
            if (videos.length === 0) {
                return resolve();
            }

            //mark all videos offline
            for (var i = 0; i < videos.length; i++) {
                videos[i].online = false;
            }

            function fetch(index) {
                index = index || 0;

                //get video IDs (max. 50 videos)
                var ids = [];
                var nextIndex = index + 50;
                for (var i = index; i < videos.length && i < nextIndex; i++) {
                    ids.push(videos[i].id);
                }

                //fetch video details
                return YoutubeApiSrv.videos(ids)
                    .then(function(data) {
                        var items = data.items;

                        //save video details
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            var details = item.contentDetails;
                            var statistics = item.statistics;

                            var videoId = item.id;
                            var video = VideosSrv.findById(videoId);
                            if (video) {
                                video.length = YTDurationToSeconds(details.duration);
                                video.stats = {};
                                video.stats.commentCount = parseInt(statistics.commentCount, 10);
                                video.stats.viewCount = parseInt(statistics.viewCount, 10);
                                video.stats.favoriteCount = parseInt(statistics.favoriteCount, 10);
                                video.stats.dislikeCount = parseInt(statistics.dislikeCount, 10);
                                video.stats.likeCount = parseInt(statistics.likeCount, 10);
                                video.online = true;

                                //extract aired date
                                if (video.title) {
                                    video.aired = null;
                                    var match = video.title.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
                                    if (match) {
                                        var day = parseInt(match[1], 10);
                                        var month = parseInt(match[2], 10);
                                        var year = parseInt(match[3], 10);

                                        video.aired = (new Date(year, month - 1, day, 12)).getTime() / 1000;
                                    }
                                }
                            }

                            progressCallback(video);
                        }

                        //continue
                        if (nextIndex < videos.length) {
                            return fetch(nextIndex);
                        }
                    })
            };

            fetch()
                .then(resolve)
                .catch(reject);
        });
    };

    $scope.updateVideos = function(channels, untilCallback) {
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
            return fetchVideos(channel, until, progressCallback)
                .then(function() {
                    //continue?
                    if (channels.length > 0) {
                        return update(channels);
                    }
                });
        };

        update(channels)
            .then(function() {

            })
            .catch(function(err) {
                console.error('error:', err);
            })
            .finally(function() {
                $scope.updateState.active = false;
                $scope.updateState.info = null;
                $scope.updateState.latest = null;

                VideosSrv.save();
                $scope.update();
            });
    };

    $scope.updateVideoDetails = function(videos) {
        $scope.updateState.active = true;
        $scope.updateState.info = 'Lade Video Details';

        function progressCallback(video) {
            $scope.updateState.latest = video;
        }

        fetchVideoDetails(videos, progressCallback)
            .then(function() {

            })
            .catch(function(err) {
                console.error('error:', err);
            })
            .finally(function() {
                $scope.updateState.active = false;
                $scope.updateState.info = null;
                $scope.updateState.latest = null;

                VideosSrv.save();
                $scope.update();
            });
    };

    $scope.updateVideosAll = function() {
        function until(channel) {
            return new Date(1970, 0, 1);
        };

        $scope.updateVideos($scope.channels, until);
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
        console.log(typeof(date), date)

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

    $scope.clearVideosCache = function() {
        $scope.videosCache = null;
    };

    $scope.update = function() {
        $scope.tableParams.reload();
    };

    $scope.init();
});
