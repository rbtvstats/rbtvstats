angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.videos', {
        abstract: true,
        url: '',
        templateUrl: 'app/viewer/videos/videos/videos.html'
    });
});
