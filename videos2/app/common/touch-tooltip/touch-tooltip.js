angular.module('app.common').directive('touchTooltip', function($tooltip) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, fn) {
            var tooltip = $tooltip(element);

            function disableClick(e) {
                e.preventDefault();
            }

            tooltip.$options.onShow = function() {
                element.off('click', disableClick);
            };
            tooltip.$options.onHide = function() {
                element.off('click', disableClick);
            };

            element.on('click', disableClick);
        }
    };
});
