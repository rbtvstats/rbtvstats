angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.shows', {
        abstract: true,
        url: '/shows',
        templateUrl: 'app/editor/videos/shows/shows.html'
    });
});
