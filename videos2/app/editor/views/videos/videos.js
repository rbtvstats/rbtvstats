angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.videos', {
        abstract: true,
        url: '/videos',
        templateUrl: 'app/editor/views/videos/videos.html'
    });
    $urlRouterProvider.when('/editor/videos', '/editor/videos/');
});
