'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:animationChanged
 * @description
 * # animationChanged
 */
app.directive('animationChanged', function($animate, $timeout) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.$watch(attrs.select, function(newVal, oldVal) {
                $animate.setClass(element, 'changed-start', 'changed-end');
                $timeout(function() {
                    $animate.setClass(element, 'changed-end', 'changed-start');
                }, 0);
            });
        }
    };
});
