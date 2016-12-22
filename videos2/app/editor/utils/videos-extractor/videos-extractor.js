angular.module('app.editor').service('VideosExtractorSrv', function($q, $filter, YoutubeApiSrv, VideosSrv, ShowsSrv, HostsSrv, SeriesSrv) {
    var service = {};

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    service.extractAired = function(video) {
        if (angular.isString(video.title)) {
            video.aired = null;
            var match = video.title.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
            if (match) {
                var day = parseInt(match[1], 10);
                var month = parseInt(match[2], 10);
                var year = parseInt(match[3], 10);

                video.aired = (new Date(year, month - 1, day, 12)).getTime() / 1000;
            }
        }
    };

    service.extractShows = function(video) {
        var allShows = ShowsSrv.all();
        var shows = [];
        var title = video.title;

        for (var i = 0; i < allShows.length; i++) {
            var show = allShows[i];
            var re = new RegExp('\\b(' + escapeRegExp(show.name) + ')\\b', 'i');
            if (title.match(re)) {
                shows.push(show);
            }
        }

        VideosSrv.addShow(video, shows);
    };

    service.extractHosts = function(video) {
        var allHosts = HostsSrv.all();
        var hosts = [];
        var title = video.title;

        for (var i = 0; i < allHosts.length; i++) {
            var host = allHosts[i];
            var names = [];
            if (host.firstname) {
                names.push(host.firstname);
            }
            if (host.nickname) {
                names.push(host.nickname);
            }

            names = _.map(names, escapeRegExp);

            var re = new RegExp('\\b(' + names.join('|') + ')\\b', 'i');
            if (title.match(re)) {
                hosts.push(host);
            }
        }

        VideosSrv.addHost(video, hosts);
    };

    service.extractSeries = function(video) {
        var allSeries = SeriesSrv.all();
        var series = [];
        var title = video.title;

        for (var i = 0; i < allSeries.length; i++) {
            var series_ = allSeries[i];
            var re = new RegExp('\\b(' + escapeRegExp(series_.name) + ')\\b', 'i');
            if (title.match(re)) {
                series.push(series_);
            }
        }

        VideosSrv.addSeries(video, series);
    };

    service.updateVideos = function(channel, until, progress) {
        if (!angular.isFunction(progress)) {
            progress = function() {};
        }

        return $q(function(resolve, reject) {
            function update(page) {
                //get playlist items
                return YoutubeApiSrv.playlistItems(channel.playlistId, page)
                    .then(function(data) {
                        var nextPage = data.nextPageToken;
                        var items = data.items;

                        //save video info
                        items = $filter('orderBy')(items, 'snippet.publishedAt', true);
                        var published = 0;
                        for (var i = 0; i < items.length; i++) {
                            var snippet = items[i].snippet;
                            published = new Date(snippet.publishedAt);

                            if (published >= until) {
                                var videoId = snippet.resourceId.videoId;
                                var video = VideosSrv.findById(videoId);
                                if (!video) {
                                    video = VideosSrv.create({ id: videoId });
                                }

                                video.id = snippet.resourceId.videoId;
                                video.title = snippet.title;
                                video.published = published.getTime() / 1000;
                                video.channel = channel.id;

                                progress(video);
                            }
                        }

                        //continue?
                        if (nextPage && published >= until) {
                            return update(nextPage);
                        }
                    });
            }

            update()
                .then(resolve)
                .catch(reject);
        });
    };

    service.updateVideoDetails = function(videos, progress) {
        if (!angular.isArray(videos)) {
            videos = [videos];
        }

        if (!angular.isFunction(progress)) {
            progress = function() {};
        }

        return $q(function(resolve, reject) {
            if (videos.length === 0) {
                return resolve();
            }

            //mark all videos offline
            for (var i = 0; i < videos.length; i++) {
                videos[i].online = false;
            }

            function update(index) {
                index = index || 0;

                //get video IDs (max. 50 videos)
                var ids = [];
                var nextIndex = index + 50;
                for (var i = index; i < videos.length && i < nextIndex; i++) {
                    ids.push(videos[i].id);
                }

                //update video details
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
                                video.duration = moment.duration(details.duration).asSeconds();
                                video.stats = {};
                                video.stats.commentCount = parseInt(statistics.commentCount, 10);
                                video.stats.viewCount = parseInt(statistics.viewCount, 10);
                                video.stats.dislikeCount = parseInt(statistics.dislikeCount, 10);
                                video.stats.likeCount = parseInt(statistics.likeCount, 10);
                                video.online = true;
                                service.extractAired(video);

                                progress(video);
                            }
                        }

                        //continue
                        if (nextIndex < videos.length) {
                            return update(nextIndex);
                        }
                    });
            }

            update()
                .then(resolve)
                .catch(reject);
        });
    };

    return service;
});
