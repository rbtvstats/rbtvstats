angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.shows', {
        abstract: true,
        url: '/shows',
        templateUrl: 'app/viewer/videos/shows/shows.html'
    });
});
