angular.module('app.common').factory('InitSrv', function($q, $timeout, Notification) {
    var service = {};
    var dependencies = [];

    service.register = function(dependency) {
        dependencies.push(dependency);
    };

    service.wait = function(ids) {
        if (angular.isUndefined(ids)) {
            ids = [];
        }

        if (!angular.isArray(ids)) {
            ids = [ids];
        }

        var promises = [];

        if (ids.length > 0) {
            promises = _(dependencies)
                //find the relevant dependencies
                .filter(function(dependency) {
                    return ids.indexOf(dependency.id) !== -1;
                })
                //get the promises
                .map(function(dependency) {
                    if (angular.isUndefined(dependency.promise)) {
                        dependency.promise = service.wait(dependency.dependencies)
                            .then(function() {
                                return $q.when(dependency.execute());
                            });
                    }

                    return dependency.promise;
                })
                .value();
        }

        return $q.all(promises);
    };

    service.run = function(init, dependencies, delay) {
        if (!angular.isFunction(init)) {
            init = function() {};
        }

        if (!angular.isArray(dependencies)) {
            dependencies = [];
        }

        if (!angular.isNumber(delay)) {
            delay = 0;
        }

        function initialize() {
            //wait for dependencies
            return service.wait(dependencies)
                .then(function() {
                    //initialize controller
                    var result = init();
                    return $q.when(result);
                });
        }

        if (delay > 0) {
            return $timeout(initialize, delay);
        } else {
            return initialize();
        }
    };

    return service;
});

angular.module('app.common').directive('init', function($animate, InitSrv) {
    return {
        restrict: 'A',
        transclude: 'element',
        priority: 600,
        terminal: true,
        link: function(scope, element, attrs, fn, $transclude) {
            InitSrv.run(scope.init, scope.initDependencies, scope.initDelay)
                .then(function() {
                    $transclude(function(clone, newScope) {
                        $animate.enter(clone, element.parent(), element);
                    });
                })
                .catch(function(err) {
                    Notification.error({
                        title: 'Fehler bei der Initialisierung',
                        message: 'Einige Teile der Seite konnten nicht geladen werden',
                        delay: null
                    });
                });
        }
    };
});
