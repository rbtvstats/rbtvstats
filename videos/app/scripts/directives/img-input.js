'use strict';

/**
 * @ngdoc directive
 * @name rbtvCrawlerApp.directive:imgInput
 * @description
 * # imgInput
 */
app.directive('imgInput', function() {
    return {
        templateUrl: 'views/template-img-input.html',
        restrict: 'A',
        scope: {
            image: '=imgInput'
        },
        controller: 'ImgInputCtrl'
    };
});
