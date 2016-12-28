angular.module('app.common').directive('imgSrc', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, fn) {
            element.attr('src', attrs.imgLoading);

            var img = new Image();

            //fallback image
            img.onerror = function() {
                element.attr('src', attrs.imgFallback);
                element.attr('img-loading', '');
                element.attr('img-fallback', '');
            };

            //show original image
            img.onload = function() {
                element.attr('src', attrs.imgSrc);
                element.attr('img-loading', '');
                element.attr('img-fallback', '');
            };

            img.src = attrs.imgSrc;
        }
    };
});
