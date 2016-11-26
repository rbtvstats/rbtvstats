'use strict';

/**
 * @ngdoc service
 * @name rbtvCrawlerApp.config
 * @description
 * # config
 * Service in the rbtvCrawlerApp.
 */
app.service('ConfigSrv', function(localStorageService, DebounceSrv) {
    var cache = null;
    var saveDebounce = DebounceSrv();
    var service = {};

    service.load = function() {
        cache = localStorageService.get('config');

        if (!cache || typeof(cache) !== 'object') {
            cache = {};
            service.save();
        }

        return cache;
    };

    service.save = function() {
        var config = service.all();

        localStorageService.set('config', config);
    };

    service.saveDelayed = function(delay) {
        saveDebounce(service.save, delay);
    };

    service.all = function() {
        return cache || service.load();
    };

    service.get = function(key) {
        var config = service.all();

        if (typeof key === 'undefined') {
            return config;
        }

        return config[key];
    };

    return service;
});
