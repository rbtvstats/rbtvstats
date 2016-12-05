angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.videos', {
        abstract: true,
        url: '/videos',
        templateUrl: 'app/editor/views/videos/videos.html'
    });
    $stateProvider.state('editor.videos.all', {
        url: '/',
        templateUrl: 'app/editor/views/videos/videos-all/videos-all.html'
    });
    $stateProvider.state('editor.videos.one', {
        url: '/:videoId',
        templateUrl: 'app/editor/views/videos/videos-one/videos-one.html'
    });
    $urlRouterProvider.when('/editor/videos', '/editor/videos/');
});
