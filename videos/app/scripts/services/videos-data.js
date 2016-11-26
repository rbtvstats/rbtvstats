'use strict';

/**
 * @ngdoc service
 * @name rbtvCrawlerApp.videosData
 * @description
 * # videosData
 * Service in the rbtvCrawlerApp.
 */
app.service('VideosDataSrv', function($q, $filter, YoutubeSrv, VideosSrv) {
    var service = {};

    function YTDurationToSeconds(duration) {
        var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

        var hours = (parseInt(match[1]) || 0);
        var minutes = (parseInt(match[2]) || 0);
        var seconds = (parseInt(match[3]) || 0);

        return hours * 3600 + minutes * 60 + seconds;
    }

    service.fetchVideos = function(channel, until, progressCallback) {
        if (typeof(progressCallback) !== 'function') {
            progressCallback = function() {};
        }

        return $q(function(resolve, reject) {
            function fetch(page) {
                //fetch playlist items
                return YoutubeSrv.playlistItems(channel.playlistId, page)
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
                .then(function() {
                    resolve();
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    };

    service.fetchVideoDetails = function(videos, progressCallback) {
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
                return YoutubeSrv.videos(ids)
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
                .then(function() {
                    resolve();
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    };

    return service;
});
