'use strict';

/**
 * @ngdoc service
 * @name rbtvCrawlerApp.youtube
 * @description
 * # youtube
 * Service in the rbtvCrawlerApp.
 */
app.service('YoutubeSrv', function($http, ConfigSrv) {
    var baseUrl = 'https://www.googleapis.com/youtube/v3/';
    var service = {};

    function key() {
        return ConfigSrv.get('youtubeApiKey');
    }

    service.channels = function(obj) {
        var parameterStr = '';
        if ('id' in obj) {
            parameterStr = '&id=' + obj['id'];
        } else if ('username' in obj) {
            parameterStr = '&forUsername=' + obj['username'];
        }

        return $http.get(baseUrl + 'channels?part=contentDetails,snippet' + parameterStr + '&key=' + key())
            .then(function(response) {
                return response.data;
            });
    };

    service.playlistItems = function(playlistId, pageToken) {
        var pageTokenStr = '';
        if (typeof pageToken === 'string') {
            pageTokenStr = '&pageToken=' + pageToken
        }

        return $http.get(baseUrl + 'playlistItems?part=snippet&playlistId=' + playlistId + '&maxResults=50' + pageTokenStr + '&key=' + key())
            .then(function(response) {
                return response.data;
            });
    };

    service.videos = function(videoIds) {
        var videoIdsStr = '';
        for (var i = 0; i < videoIds.length; i++) {
            if (i > 0) {
                videoIdsStr += ',';
            }

            videoIdsStr += videoIds[i];
        }

        return $http.get(baseUrl + 'videos?part=contentDetails,statistics&id=' + videoIdsStr + '&key=' + key())
            .then(function(response) {
                return response.data;
            });
    };

    return service;
});
