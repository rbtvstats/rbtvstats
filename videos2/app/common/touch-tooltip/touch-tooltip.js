angular.module('app.common').directive('touchTooltip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, fn) {
            function disableClick(e) {
                e.preventDefault();
            }

            scope.$watch(attrs.touchTooltip, function(newVal, oldVal) {
                if (newVal === true) {
                    element.off('click', disableClick);
                } else {
                    element.on('click', disableClick);
                }
            });
        }
    };
});
