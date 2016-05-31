'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:slideIn
 * @description
 * # slideIn
 */
app.directive('slideIn', function($timeout) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            element.addClass("slide-in start");
            $timeout(function() {
                if (element.visible(true)) {
                    element.removeClass("start");
                } else {
                    var scrollListener = function(event) {
                        if (element.visible(true)) {
                            element.removeClass("start");
                            $(window).off("scroll", scrollListener);
                        }
                    };

                    $(window).on("scroll", scrollListener);
                }
            }, 0);
        }
    };
});

$.fn.visible = function(partial) {
    var $t = $(this);
    var $w = $(window);
    var viewTop = $w.scrollTop();
    var viewBottom = viewTop + $w.height();
    var _top = $t.offset().top;
    var _bottom = _top + $t.height();
    var compareTop = partial === true ? _bottom : _top;
    var compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
};
