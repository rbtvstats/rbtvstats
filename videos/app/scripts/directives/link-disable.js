'use strict';

/**
 * @ngdoc directive
 * @name rbtvCrawlerApp.directive:linkDisable
 * @description
 * # linkDisable
 */
app.directive('linkDisable', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            property: '=linkDisable'
        },
        link: function postLink(scope, element, attrs) {
            var href = attrs.ngHref;

            function setHref(state) {
                if (state) {
                    element.attr('href', href);
                    element.attr('ng-href', href);
                } else {
                    element.attr('href', 'javascript:void(0);');
                    element.attr('ng-href', 'javascript:void(0);');
                }
            }

            scope.$watch('property', function(newVal, oldVal) {
                $timeout(function() {
                    setHref(scope.property);
                }, 500);
            });

            setHref(false);
        }
    };
});
