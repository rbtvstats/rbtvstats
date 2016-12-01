angular.module('app.common').service('StateSrv', function($rootScope, $location, localStorageService) {
    var cache = null;
    var service = {};

    function getStorage() {
        if (!cache) {
            cache = localStorageService.get('state');
            if (!cache) {
                cache = {};
                setStorage(cache);
            }
        }

        return cache;
    }

    function setStorage(storage) {
        localStorageService.set('state', storage);
    }

    function saveState(path, scope, properties) {
        var storage = getStorage();

        storage[path] = storage[path] || {};
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            var value = scope[property];
            storage[path][property] = value;
        }

        setStorage(storage);
    }

    function loadState(path, scope, properties) {
        var storage = getStorage();

        if (path in storage) {
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                var value = storage[path][property];
                if (typeof(value) !== 'undefined') {
                    scope[property] = value;
                }
            }
        } else {
            saveState(path, scope, properties);
        }
    }

    function watch(path, scope, property, properties) {
        var init = false;
        scope.$watch(property, function(newVal, oldVal) {
            if (!init) {
                init = true;
                loadState(path, scope, properties);
            } else {
                saveState(path, scope, properties);
            }
        }, true);
    }

    service.watch = function(scope, properties) {
        var path = $location.path();
        for (var i = 0; i < properties.length; i++) {
            watch(path, scope, properties[i], properties);
        }
    };

    return service;
});
