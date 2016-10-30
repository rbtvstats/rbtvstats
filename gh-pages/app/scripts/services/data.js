'use strict';

/**
 * @ngdoc service
 * @name rbtvstatsApp.data
 * @description
 * # data
 * Service in the rbtvstatsApp.
 */
app.service('DataSrv', function($http, $q) {
    var fetchedVideoData = [];
    var fetchedLiveData = [];
    var service = {};

    service.getVideoMetadata = function() {
        return $http.get('https://raw.githubusercontent.com/rbtvstats/rbtvdata/master/video/metadata.json').then(function(response) {
            return response.data;
        });
    };

    service.getVideoData = function(from, to) {
        var requests = [];

        function pad(n) {
            return (n < 10) ? ('0' + n) : n;
        }

        to = to || new Date();
        while (from <= to) {
            var filename = from.getFullYear() + '-' + pad(from.getMonth() + 1) + '.json';
            if (fetchedVideoData.indexOf(filename) == -1) {
                fetchedVideoData.push(filename);

                requests.push($http.get('https://raw.githubusercontent.com/rbtvstats/rbtvdata/master/video/' + filename));
            }

            from.setMonth(from.getMonth() + 1);
        }

        return $q.all(requests).then(function(responses) {
            var data = [];

            if (responses) {
                for (var i = 0; i < responses.length; i++) {
                    data = data.concat(responses[i].data);
                }
            }

            return data;
        });
    };

    service.getLiveMetadata = function() {
        return $http.get('https://raw.githubusercontent.com/rbtvstats/rbtvdata/master/live/metadata.json').then(function(response) {
            return response.data;
        });
    };

    service.getLiveData = function(from, to) {
        var requests = [];

        function pad(n) {
            return (n < 10) ? ('0' + n) : n;
        }

        to = to || new Date();
        to = new Date(to.getFullYear(), to.getMonth());
        from = new Date(from.getFullYear(), from.getMonth());

        while (from <= to) {
            var filename = from.getFullYear() + '-' + pad(from.getMonth() + 1) + '.csv';
            if (fetchedLiveData.indexOf(filename) == -1) {
                fetchedLiveData.push(filename);

                requests.push($http.get('https://raw.githubusercontent.com/rbtvstats/rbtvdata/master/live/' + filename))
            }

            from.setMonth(from.getMonth() + 1);
        }

        return $q.all(requests).then(function(responses) {
            var live = [];

            if (responses) {
                for (var i = 0; i < responses.length; i++) {
                    var data = responses[i].data;
                    var lines = data.split('\n');
                    for (var j = 0; j < lines.length; j++) {
                        var line = lines[j].split(',');
                        if (line.length === 2) {
                            live.push({
                                time: new Date(parseInt(line[0], 10) * 1000),
                                viewers: parseInt(line[1], 10)
                            });
                        }
                    }
                }
            }

            return live;
        });
    };

    return service;
});
