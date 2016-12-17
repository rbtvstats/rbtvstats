angular.module('app.common').factory('DependencySrv', function($q, $timeout, Notification) {
    var service = {};

    var dependencies = [];
    service.register = function(id, func) {
        dependencies.push({
            id: id,
            execute: func,
            promise: null
        });
    };

    service.wait = function(ids) {
        if (!angular.isArray(ids)) {
            ids = [ids];
        }

        var promises = _(dependencies)
            //find the relevant dependencies
            .filter(function(dependency) {
                return ids.indexOf(dependency.id) !== -1;
            })
            //get the promises
            .map(function(dependency) {
                if (dependency.promise === null) {
                    dependency.promise = $q.when(dependency.execute())
                        .then(function() {

                        })
                        .catch(function(err) {
                            Notification.error({
                                title: 'Fehler bei der Initialisierung',
                                message: 'Einige Teile der Seite konnten nicht geladen werden',
                                delay: null
                            });
                        });
                }

                return dependency.promise;
            })
            .value();

        return $q.all(promises);
    };

    return service;
});

//https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js#L81
angular.module('app.common').directive('init', function($animate, $q, $timeout, DependencySrv) {
    return {
        restrict: 'A',
        transclude: 'element',
        priority: 600,
        terminal: true,
        link: function(scope, element, attrs, fn, $transclude) {
            var init = function() {};
            var delay = 0;
            var dependencies = [];

            if (angular.isFunction(scope.init)) {
                init = scope.init;
            }

            if (angular.isNumber(scope.initDelay)) {
                delay = scope.initDelay;
            }

            if (angular.isArray(scope.initDependencies)) {
                dependencies = scope.initDependencies;
            }

            var initialized = function() {
                $transclude(function(clone, newScope) {
                    $animate.enter(clone, element.parent(), element);
                });
            };

            function initialize() {
                //wait for dependencies
                DependencySrv.wait(dependencies)
                    .then(function() {
                        //initialize controller
                        var result = init();
                        $q.when(result)
                            .then(function() {
                                initialized();
                            });
                    });
            }

            if (delay > 0) {
                $timeout(initialize, delay);
            } else {
                initialize();
            }
        }
    };
});
