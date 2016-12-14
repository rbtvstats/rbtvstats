angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.channels', {
        abstract: true,
        url: '/channels',
        templateUrl: 'app/viewer/videos/channels/channels.html'
    });
});
