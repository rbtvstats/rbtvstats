angular.module('app.common').service('StateSrv', function($rootScope, $parse, $state) {
    var storage = {};
    var service = {};

    function saveStateLocal(container, scope, models) {
        storage[container] = storage[container] || {};

        _.each(models, function(model, path) {
            storage[container][path] = model(scope);
        });

        service.saveLocal();
    }

    function loadStateLocal(container, scope, models) {
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

    service.saveLocal = _.debounce(function() {
        console.log('save state');

        localforage.setItem('state', storage);
    }, 1000);

    service.watch = function(scope, properties) {
        var container = $state.current.name;

        var models = {};
        _.each(properties, function(property) {
            models[property] = $parse(property);
        });

        if (container in storage) {
            loadStateLocal(container, scope, models);
        } else {
            saveStateLocal(container, scope, models);
        }

        _.each(properties, function(property) {
            scope.$watch(property, function(newVal, oldVal) {
                saveStateLocal(container, scope, models);
            }, true);
        });
    };

    return service;
});
