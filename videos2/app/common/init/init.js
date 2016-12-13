angular.module('app.common').factory('InitSrv', function($q, $timeout) {
    var service = {};

    service.init = function(scope, initFunc, delay) {
        if (!angular.isNumber(delay)) {
            delay = 0;
        }

        if (delay > 0) {
            scope.initialized = false;
            $timeout(function() {
                var ret = initFunc();
                $q.when(ret).then(function() {
                    scope.initialized = true;
                });
            }, delay);
        } else {
            var ret = initFunc();
            $q.when(ret).then(function() {
                scope.initialized = true;
            });
        }
    };

    return service;
});
