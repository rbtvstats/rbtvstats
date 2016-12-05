angular.module('app.common').service('StateSrv', function($rootScope, $location) {
    var storage = {};
    var service = {};

    function saveState(path, scope, properties) {
        storage[path] = storage[path] || {};
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            var value = scope[property];
            storage[path][property] = value;
        }

        service.save();
    }

    function loadState(path, scope, properties) {
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

    service.loadLocal = function() {
        return localforage.getItem('state')
            .then(function(data) {
                storage = data || {};
            });
    };

    service.save = _.debounce(function() {
        localforage.setItem('state', storage);
    }, 1000);

    service.watch = function(scope, properties) {
        var path = $location.path();
        for (var i = 0; i < properties.length; i++) {
            watch(path, scope, properties[i], properties);
        }
    };

    return service;
});
