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

    service.getMetadata = function() {
        return $http.get('/data/metadata.json').then(function(response) {
            return response.data;
        });
    };

    service.getData = function() {
        return $http.get('/data/data.json').then(function(response) {
            return response.data;
        });
    };

    return service;
});
