angular.module('app.viewer').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('viewer.videos', {
        abstract: true,
        url: '/videos',
        templateUrl: 'app/viewer/views/videos/videos.html'
    });
    $urlRouterProvider.when('/videos', '/videos/');
});
