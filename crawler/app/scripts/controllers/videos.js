'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:VideosCtrl
 * @description
 * # VideosCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('VideosCtrl', function($scope, $rootScope, storageSrv, videosSrv) {
    var init = function() {
        $rootScope.config = storageSrv.getConfig();
        $scope.filterIgnoredVideos = false;
        $scope.filterNoHostVideos = false;
        $scope.filterNoShowVideos = false;
        $scope.loading = false;
        $scope.pageSize = 50;
        $scope.lastEdited = null;
        $scope.selectedChannel = $rootScope.config.channels[0];
        $scope.channelDetails = {};
        $scope.nextPageToken = {};
        $scope.videos = {};
        $scope.metadata = storageSrv.getMetadata();;

        $scope.updateChannel();
    };

    var YTDurationToSeconds = function(duration) {
        var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

        var hours = (parseInt(match[1]) || 0);
        var minutes = (parseInt(match[2]) || 0);
        var seconds = (parseInt(match[3]) || 0);

        return hours * 3600 + minutes * 60 + seconds;
    }

    var getVideoById = function(videoID) {
        var videos = $scope.videos[$scope.selectedChannel];
        for (var i = 0; i < videos.length; i++) {
            if (videos[i].snippet.resourceId.videoId == videoID) {
                return videos[i];
            }
        }
    };

    var getMetadataById = function(videoID) {
        if (!(videoID in $scope.metadata)) {
            $scope.metadata[videoID] = {};
        }

        return $scope.metadata[videoID];
    };

    $scope.toList = function(array) {
        return array.join(", ");
    };

    $scope.toggleIgnore = function(video) {
        if (video.snippet.metadata.ignore) {
            delete video.snippet.metadata.ignore;
        } else {
            video.snippet.metadata.ignore = true;
        }

        storageSrv.setMetadata($scope.metadata);
    };

    $scope.autoHosts = function(video) {
        var hosts = [];
        var title = video.snippet.title.toLowerCase();
        title = title.replace('etienne', 'eddy');

        console.log(title)

        for (var i = 0; i < $rootScope.config.hosts.length; i++) {
            var host = $rootScope.config.hosts[i];
            if (title.indexOf(host.toLowerCase()) > -1) {
                hosts.push(host);
            }
        }

        $scope.addHost(video, hosts);
    };

    $scope.addHost = function(video, hosts) {
        if (typeof video.snippet.metadata.hosts === 'undefined') {
            video.snippet.metadata.hosts = [];

            //var metadata = getMetadataById(video.snippet.resourceId.videoId);
            //metadata.hosts = video.snippet.metadata.hosts;
        }

        if (!$.isArray(hosts)) {
            hosts = [hosts];
        }

        for (var i = 0; i < hosts.length; i++) {
            if (video.snippet.metadata.hosts.indexOf(hosts[i]) == -1 && hosts[i]) {
                video.snippet.metadata.hosts.push(hosts[i]);
            }
        }

        $scope.lastEdited = video;
    };

    $scope.removeHost = function(video, host) {
        video.snippet.metadata.hosts = video.snippet.metadata.hosts || [];
        video.snippet.metadata.hosts.splice(video.snippet.metadata.hosts.indexOf(host), 1);

        $scope.lastEdited = video;

        storageSrv.setMetadata($scope.metadata);
    };

    $scope.autoShows = function(video) {
        var title = video.snippet.title.toLowerCase();
        title = title.replace('Game Plus Daily', 'Game+ Daily');
        title = title.replace('let\'s play', 'lets play');

        for (var i = 0; i < $rootScope.config.shows.length; i++) {
            var show = $rootScope.config.shows[i];
            if (title.indexOf(show.toLowerCase()) > -1) {
                $scope.addShow(video, show);
                break;
            }
        }
    };

    $scope.addShow = function(video, shows) {
        if (typeof video.snippet.metadata.shows === 'undefined') {
            video.snippet.metadata.shows = [];

            //var metadata = getMetadataById(video.snippet.resourceId.videoId);
            //metadata.shows = video.snippet.metadata.shows;
        }

        if (!$.isArray(shows)) {
            shows = [shows];
        }

        for (var i = 0; i < shows.length; i++) {
            if (video.snippet.metadata.shows.indexOf(shows[i]) == -1 && shows[i]) {
                video.snippet.metadata.shows.push(shows[i]);
            }
        }

        $scope.lastEdited = video;
    };

    $scope.removeShow = function(video, show) {
        video.snippet.metadata.shows = video.snippet.metadata.shows || [];
        video.snippet.metadata.shows.splice(video.snippet.metadata.shows.indexOf(show), 1);

        $scope.lastEdited = video;
    };

    $scope.showVideoInfo = function(video) {
        console.log(video);
    };

    $scope.paste = function(video) {
        var hosts = $scope.lastEdited.snippet.metadata.hosts;
        var shows = $scope.lastEdited.snippet.metadata.shows;
        $scope.addHost(video, hosts);
        $scope.addShow(video, shows);
    };

    $scope.fixStats = function() {
        for (var channel in $scope.videos) {
            var channelVideos = $scope.videos[channel];
            for (var videoID in channelVideos) {
                var video = channelVideos[videoID];

                if (!video.snippet.statistics) {
                    console.log(videoID);
                }
            }
        }
    };

    $scope.importData = function() {
        var data = JSON.parse($scope.data);
        if (typeof data !== 'object') {
            data = {};
        }

        for (var videoID in data) {
            var metadata = getMetadataById(videoID);
            metadata.hosts = data[videoID].hosts || [];
            metadata.shows = data[videoID].shows || [];
        }
    };

    $scope.exportData = function() {
        var minDate = new Date(2015, 2, 3);
        var data = {};
        var videos = [];
        for (var key in $scope.videos) {
            videos = videos.concat($scope.videos[key]);
        }

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var videoID = video.snippet.resourceId.videoId;
            var date = new Date(video.snippet.publishedAt);

            if (date > minDate) {
                data[videoID] = {};
                data[videoID].id = videoID;
                data[videoID].channel = video.snippet.channelTitle;
                data[videoID].length = video.snippet.duration;
                data[videoID].published = date.getTime() / 1000;
                data[videoID].title = video.snippet.title;
                data[videoID].hosts = video.snippet.metadata.hosts || [];
                data[videoID].shows = video.snippet.metadata.shows || [];
                data[videoID].stats = video.snippet.statistics;
            }
        }

        $scope.data = JSON.stringify(data, null, "\t");
    };

    $scope.updateChannel = function() {
        var channel = $scope.selectedChannel;
        if (!$scope.channelDetails[channel]) {
            $scope.nextPageToken[channel] = null;
            $scope.videos[channel] = [];
            $scope.loading = true;
            videosSrv.getChannelDetails(channel).then(function(data) {
                $scope.channelDetails[channel] = data;
                $scope.loadNext();
            });
        }
    };

    $scope.loadUntil = function(year, month, day) {
        $scope.loadNext(new Date(year, month - 1, day));
    };

    $scope.loadNext = function(date) {
        $scope.loading = true;
        videosSrv.getVideos($scope.channelDetails[$scope.selectedChannel].items[0].contentDetails.relatedPlaylists.uploads, $scope.nextPageToken[$scope.selectedChannel]).then(function(data) {
            var videos = data.items;

            for (var i = 0; i < videos.length; i++) {
                var metadata = getMetadataById(videos[i].snippet.resourceId.videoId);
                videos[i].snippet.metadata = metadata;
            }

            //retrieve video details
            var videoIDsStr = '';
            for (var i = 0; i < videos.length; i++) {
                if (i > 0) {
                    videoIDsStr += ',';
                }
                videoIDsStr += videos[i].snippet.resourceId.videoId;
            }

            videosSrv.getVideoDetails(videoIDsStr).then(function(data) {
                for (var i = 0; i < data.items.length; i++) {
                    var details = data.items[i];
                    var video = getVideoById(details.id);
                    video.snippet.duration = YTDurationToSeconds(details.contentDetails.duration);

                    video.snippet.statistics = {};
                    for (var key in details.statistics) {
                        video.snippet.statistics[key] = Number(details.statistics[key]); //fix data type
                    }
                }
            });

            $scope.videos[$scope.selectedChannel] = $scope.videos[$scope.selectedChannel].concat(videos);
            $scope.nextPageToken[$scope.selectedChannel] = data.nextPageToken;

            if (date instanceof Date) {
                var next = true;
                for (var i = 0; i < videos.length; i++) {
                    var publishedAt = new Date(videos[i].snippet.publishedAt);
                    if (publishedAt < date) {
                        next = false;
                    }
                }

                if (next) {
                    $scope.loadNext(date);
                } else {
                    $scope.loading = false;
                }
            } else {
                $scope.loading = false;
            }
        });
    };

    $scope.$watch('config', function(newVal, oldVal) {
        storageSrv.setConfig($rootScope.config);
    }, true);

    $scope.$watch('metadata', function(newVal, oldVal) {
        storageSrv.setMetadata($scope.metadata);
    }, true);

    init();
});
