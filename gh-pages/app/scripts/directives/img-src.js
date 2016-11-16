'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:imgSrc
 * @description
 * # imgSrc
 */
app.directive('imgSrc', function($http, $timeout) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            element.attr('src', attrs.imgSrc);
            element.hide();

            //create loading image
            var imgLoadingElement = $('<img src="' + attrs.imgLoading + '" class="' + attrs.class + '">');
            element.after(imgLoadingElement);

            //fallback image
            element.bind('error', function() {
                element.attr('src', attrs.imgFallback);
                imgLoadingElement.hide();
                element.show();
            });

            //show original image
            element.bind('load', function() {
                imgLoadingElement.hide();
                element.show();
            });
        }
    };
});
