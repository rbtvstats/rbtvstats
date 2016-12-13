angular.module('app.common').directive('dateRangePicker', function($parse, $animate) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, fn) {
            var container = element.data('daterangepicker').container;
            var options = $parse(attrs.options)(scope);
            var eventHandlers = options.eventHandlers = options.eventHandlers || {};

            eventHandlers['show.daterangepicker'] = function() {
                var container = element.data('daterangepicker').container;
                $animate.addClass(container, 'open');
            }

            eventHandlers['hide.daterangepicker'] = function() {
                var container = element.data('daterangepicker').container;
                $animate.removeClass(container, 'open');
            }
        }
    };
});
