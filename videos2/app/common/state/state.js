angular.module('app.common').service('StateSrv', function($rootScope, $parse, $state) {
    var storage = {};
    var service = {};

    function saveState(container, scope, models) {
        storage[container] = storage[container] || {};

        _.each(models, function(model, path) {
            storage[container][path] = model(scope);
        });

        service.save();
    }

    function loadState(container, scope, models) {
        _.each(models, function(model, path) {
            var value = storage[container][path];
            if (!angular.isUndefined(value)) {
                model.assign(scope, value);
            }
        });
    }

    service.loadLocal = function() {
        return localforage.getItem('state')
            .then(function(data) {
                storage = data || {};
            });
    };

    service.save = _.debounce(function() {
        console.log('save state');

        localforage.setItem('state', storage);
    }, 1000);

    service.watch = function(scope, properties) {
        var container = $state.current.name;

        var models = {};
        _.each(properties, function(property) {
            models[property] = $parse(property);
        });

        _.each(properties, function(property) {
            var init = false;
            scope.$watch(property, function(newVal, oldVal) {
                if (!init) {
                    init = true;
                    if (container in storage) {
                        loadState(container, scope, models);
                    } else {
                        saveState(container, scope, models);
                    }
                } else {
                    saveState(container, scope, models);
                }
            }, true);
        });
    };

    return service;
});
