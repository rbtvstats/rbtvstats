'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:blank
 * @description
 * # blank
 */
app.directive('blank', function($document) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var href = attrs.href || attrs.ngHref;

            if (href.indexOf('#') != 0) {
                element.attr("target", "_blank");
            } else {
                var scrollTo = attrs.scrollTo;
                var top = angular.element(document.getElementById(scrollTo));
                if (top.length) {
                    $document.scrollToElementAnimated(top);
                }
            }
        }
    };
});
