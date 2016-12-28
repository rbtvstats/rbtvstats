angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.videos', {
        abstract: true,
        url: '',
        templateUrl: 'app/editor/videos/videos/videos.html'
    });
});
