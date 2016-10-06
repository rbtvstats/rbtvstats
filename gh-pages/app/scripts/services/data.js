'use strict';

/**
 * @ngdoc service
 * @name rbtvstatsApp.data
 * @description
 * # data
 * Service in the rbtvstatsApp.
 */
app.service('DataSrv', function($http, $q) {
    var service = {};

    service.getVideoMetadata = function() {
        return $http.get('https://raw.githubusercontent.com/rbtvstats/rbtvdata/master/video/metadata.json').then(function(response) {
            return response.data;
        });
    };

    service.getVideoData = function(date) {
        var requests = [];

        function pad(n) {
            return (n < 10) ? ("0" + n) : n;
        }

        var now = new Date();
        while (date < now) {
            var filename = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '.json';
            requests.push($http.get('https://raw.githubusercontent.com/rbtvstats/rbtvdata/master/video/' + filename));
            date.setMonth(date.getMonth() + 1);
        }

        return $q.all(requests).then(function(responses) {
            var data = [];
            for (var i = 0; i < responses.length; i++) {
                data = data.concat(responses[i].data);
            }

            return data;
        });
    };

    service.getLiveMetadata = function() {
        return $http.get('https://raw.githubusercontent.com/rbtvstats/rbtvdata/master/live/metadata.json').then(function(response) {
            return response.data;
        });
    };

    service.getLiveData = function(date) {
        var requests = [];

        function pad(n) {
            return (n < 10) ? ("0" + n) : n;
        }

        var now = new Date();
        while (date < now) {
            var filename = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '.csv';
            requests.push($http.get('https://raw.githubusercontent.com/rbtvstats/rbtvdata/master/live/' + filename))
            date.setMonth(date.getMonth() + 1);
        }

        return $q.all(requests).then(function(responses) {
            var data = '';
            for (var i = 0; i < responses.length; i++) {
                data += responses[i].data;
            }

            return data;
        });
    };

    return service;
});
