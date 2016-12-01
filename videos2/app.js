angular.module('videoCrawler', [
    'ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'app'
]);

angular.module('videoCrawler').config(function($stateProvider) {

});

angular.module('videoCrawler').run(function($rootScope) {
    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
});
