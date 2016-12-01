angular.module('app.common').directive('imgSrc', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, fn) {
            element.attr('src', attrs.imgLoading);

            var img = new Image();

            //fallback image
            img.onerror = function() {
                element.attr('src', attrs.imgFallback);
            };

            //show original image
            img.onload = function() {
                element.attr('src', attrs.imgSrc);
            };

            img.src = attrs.imgSrc;
        }
    };
});
