angular.module('app.data.live').service('LiveDataSrv', function($timeout, $filter, $http, $q, ConfigSrv) {
    var service = {};
    var cachedFiles = null;
    var cache = null;
    var cacheMetadata = null;

    function binaryClosest(array, time) {
        var minIndex = -1;
        var maxIndex = array.length;
        var currentIndex;
        var currentElement;

        var c = 0;
        while ((maxIndex - minIndex) > 1) {
            currentIndex = Math.round((minIndex + maxIndex) / 2);
            currentElement = array[currentIndex].time;

            if (currentElement <= time) {
                minIndex = currentIndex;
            } else {
                maxIndex = currentIndex;
            }
        }

        if (currentIndex < array.length) {
            if (array[currentIndex].time === time) {
                maxIndex = minIndex;
            }
        }

        return [minIndex, maxIndex];
    }

    service.clear = function() {
        cachedFiles = cachedFiles || [];
        cachedFiles.length = 0;
        cache = cache || [];
        cache.length = 0;
    };

    service.loadRemoteMetadata = function() {
        var url = urljoin(ConfigSrv.get('githubBaseUrl'), ConfigSrv.get('githubRepository'), ConfigSrv.get('githubBranch'), ConfigSrv.get('livePath'), '/metadata.json?' + moment().unix());

        return $http.get(url)
            .then(function(response) {
                cacheMetadata = response.data;

                return cacheMetadata;
            });
    };

    service.metadata = function() {
        return cacheMetadata;
    };

    service.loadRemote = function(start, end, cache) {
        if (!angular.isNumber(start)) {
            start = 0;
        }

        if (!angular.isNumber(end)) {
            end = moment().unix();
        }

        if (angular.isUndefined(cache)) {
            cache = true;
        }

        var files;
        return service.loadRemoteMetadata()
            .then(function(metadata) {
                var baseUrl = urljoin(ConfigSrv.get('githubBaseUrl'), ConfigSrv.get('githubRepository'), ConfigSrv.get('githubBranch'), ConfigSrv.get('livePath'));

                //get remote file paths
                files = _(metadata.files)
                    //filter relevant files
                    .filter(function(file) {
                        return file.end >= start && end >= file.start;
                    })
                    //get file url
                    .map(function(file) {
                        return urljoin(baseUrl, file.filename);
                    })
                    //filter already cached files
                    .filter(function(file) {
                        if (cache) {
                            return cachedFiles.indexOf(file) === -1;
                        } else {
                            return true;
                        }
                    })
                    .value();

                //download all files
                var promises = _.map(files, function(file) {
                    return $http.get(file);
                });

                return $q.all(promises);
            })
            .then(function(results) {
                var promises = _.map(results, function(result) {
                    //defer result processing
                    return $timeout(function() {
                        var data = [];
                        var lines = result.data.split('\n');
                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i].split(',');
                            if (line.length === 2) {
                                data.push({
                                    time: parseInt(line[0]),
                                    viewers: parseInt(line[1])
                                });
                            }
                        }

                        return data;
                    }, 10);
                });

                return $q.all(promises);
            })
            .then(function(results) {
                if (results.length > 0) {
                    var data = _.flatten(results);

                    service.load(data, cache);

                    cachedFiles = _.concat(cachedFiles, files);
                }

                return cache;
            });
    };

    service.load = function(data, partial) {
        if (partial) {
            if (angular.isArray(data)) {
                angular.assign(data, cache, false);
            }
        } else {
            service.clear();

            if (data !== cache && angular.isArray(data)) {
                angular.assign(data, cache);
            }
        }

        cache.sort(function(a, b) {
            if (a.time < b.time) {
                return -1;
            }
            if (a.time > b.time) {
                return 1;
            }

            return 0;
        });

        return cache;
    };

    service.total = function() {
        return cache.length;
    };

    service.all = function() {
        return cache;
    };

    service.find = function(properties) {
        return $filter('filter')(cache, properties, true);
    };

    service.filter = function(data, start, end) {
        if (!angular.isArray(data) || data.length === 0) {
            return [];
        }

        var startIndex = Number.NEGATIVE_INFINITY;
        var endIndex = Number.POSITIVE_INFINITY;

        if (angular.isNumber(start)) {
            var closestStart = binaryClosest(data, start);

            startIndex = closestStart[0];
        }

        if (angular.isNumber(end)) {
            var closestEnd = binaryClosest(data, end);

            endIndex = closestEnd[1];
        }

        if (startIndex < 0) {
            startIndex = 0;
        }

        if (endIndex > data.length - 1) {
            endIndex = data.length - 1;
        }

        return data.slice(startIndex, endIndex);
    };

    service.clear();

    return service;
});
