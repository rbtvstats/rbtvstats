'use strict';

/**
 * @ngdoc service
 * @name rbtvstatsApp.data
 * @description
 * # data
 * Service in the rbtvstatsApp.
 */
app.service('DataSrv', function($http) {
    var service = {};

    service.getVideoMetadata = function() {
        return $http.get('/data/video_metadata.json').then(function(response) {
            return response.data;
        });
    };

    service.getVideoData = function() {
        return $http.get('/data/video_data.json').then(function(response) {
            return response.data;
        });
    };

    service.getLiveMetadata = function() {
        return $http.get('/data/live_metadata.json').then(function(response) {
            return response.data;
        });
    };

    service.getLiveData = function() {
        return $http.get('/data/live_data.csv').then(function(response) {
            return response.data;
        });
    };

    return service;
});
