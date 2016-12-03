angular.module('app.common').service('ConfigSrv', function(localStorageService) {
    var cache = null;
    var service = {};

    service.clear = function() {
        cache = cache || {};
        angular.copy({}, cache);
    };

    service.default = function() {
        return {
            youtubeApiKey: '',
            githubOAuthToken: '',
            githubBaseUrl: 'https://raw.githubusercontent.com',
            githubRepository: 'rbtvstats/rbtvdata',
            githubBranch: 'master',
            videosPath: 'videos',
            livePath: 'live'
        };
    };

    service.load = function(config) {
        service.clear();

        if (!angular.isObject(config)) {
            config = localStorageService.get('config') || service.default();
        }

        angular.copy(config, cache);

        return cache;
    };

    service.save = _.debounce(function() {
        var config = service.all();
        localStorageService.set('config', config);
    }, 1000);

    service.all = function() {
        return cache || service.load();
    };

    service.get = function(key) {
        var config = service.all();

        if (angular.isUndefined(key)) {
            return config;
        }

        return config[key];
    };

    return service;
});
