'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:animateChange
 * @description
 * # animateChange
 */
app.directive('animateChange', function($animate, $timeout) {
    return function(scope, elem, attr) {
        scope.$watch(attr.animateChange, function(newValue, oldValue) {
            var c = 'change';
            $animate.addClass(elem, c).then(function() {
                $timeout(function() {
                    $animate.removeClass(elem, c);
                });
            });
        });
    };
});
