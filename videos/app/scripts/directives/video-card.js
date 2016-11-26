'use strict';

/**
 * @ngdoc directive
 * @name rbtvCrawlerApp.directive:videoCard
 * @description
 * # videoCard
 */
app.directive('videoCard', function() {
    return {
        templateUrl: 'views/template-video-card.html',
        restrict: 'A',
        scope: {
            video: '=videoCard'
        },
        link: function postLink(scope, element, attrs) {
            function hideMetadata(e) {
                scope.hideMetadata();
                scope.$apply();
            }

            scope.$watch('metadataVisible', function(newVal, oldVal) {
                if (newVal) {
                    $('.videos-close-container').on('click', hideMetadata);
                } else {
                    $('.videos-close-container').off('click', hideMetadata);
                }
            });
        },
        controller: 'VideoCardCtrl'
    };
});
