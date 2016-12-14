angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.series', {
        abstract: true,
        url: '/series',
        templateUrl: 'app/editor/videos/series/series.html'
    });
});
