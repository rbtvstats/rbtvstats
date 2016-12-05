angular.module('app.common').service('ConfigSrv', function() {
    var cache = null;
    var service = {};

    service.default = function() {
        return angular.copy({
            youtubeApiKey: '',
            githubOAuthToken: '',
            githubBaseUrl: 'https://raw.githubusercontent.com',
            githubRepository: 'rbtvstats/rbtvdata',
            githubBranch: 'master',
            videosPath: 'videos',
            livePath: 'live'
        });
    };

    service.clear = function() {
        cache = cache || {};
        angular.copy({}, cache);
    };

    service.loadLocal = function(config) {
        return localforage.getItem('config')
            .then(function(data) {
                service.clear();

                if (!data) {
                    data = service.default();
                }

                angular.copy(data, cache);

                return cache;
            });
    };

    service.load = function(config) {
        if (config !== cache && angular.isObject(config)) {
            service.clear();

            angular.copy(config, cache);
        }

        return cache;
    };

    service.save = _.debounce(function() {
        var config = service.all();
        localforage.setItem('config', config);
    }, 1000);

    service.all = function() {
        return cache;
    };

    service.get = function(key) {
        var config = service.all();

        if (angular.isUndefined(key)) {
            return config;
        }

        return config[key];
    };

    service.clear();

    return service;
});
