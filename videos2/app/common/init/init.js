angular.module('app.common').factory('InitSrv', function($q, $timeout) {
    var service = {};

    var dependencies = {};
    service.register = function(id, promise) {
        dependencies[id] = promise;
    };

    service.wait = function(dependency) {
        if (!angular.isArray(dependency)) {
            dependency = [dependency];
        }

        var promises = _(dependencies)
            .pick(dependency)
            .values()
            .value();

        return $q.all(promises);
    };

    return service;
});

//https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js#L81
angular.module('app.common').directive('init', function($animate, $q, $timeout, InitSrv) {
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
                InitSrv.wait(dependencies)
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
