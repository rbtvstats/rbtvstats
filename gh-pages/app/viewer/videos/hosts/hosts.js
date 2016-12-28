angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.hosts', {
        abstract: true,
        url: '/hosts',
        templateUrl: 'app/viewer/videos/hosts/hosts.html'
    });
});
