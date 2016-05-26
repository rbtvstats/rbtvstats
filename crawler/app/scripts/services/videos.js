'use strict';

/**
 * @ngdoc service
 * @name rbtvstatsApp.videos
 * @description
 * # videos
 * Service in the rbtvstatsApp.
 */
app.service('videosSrv', function($rootScope, $http) {
    var service = {};

    service.getChannelDetails = function(channel) {
        return $http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + channel + '&key=' + $rootScope.config.youtubeApiKey).then(function(response) {
            return response.data;
        });
    };

    service.getVideos = function(playlistID, pageToken) {
        var pageTokenStr = '';
        if (typeof pageToken === 'string') {
            pageTokenStr = '&pageToken=' + pageToken
        }
        return $http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + playlistID + '&maxResults=50' + pageTokenStr + '&key=' + $rootScope.config.youtubeApiKey).then(function(response) {
            return response.data;
        });
    };

    service.getVideoDetails = function(videoID) {
        return $http.get('https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=' + videoID + '&key=' + $rootScope.config.youtubeApiKey).then(function(response) {
            return response.data;
        });
    };

    return service;
});
