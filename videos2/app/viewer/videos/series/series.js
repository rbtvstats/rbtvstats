angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.series', {
        abstract: true,
        url: '/series',
        templateUrl: 'app/viewer/videos/series/series.html'
    });
});
