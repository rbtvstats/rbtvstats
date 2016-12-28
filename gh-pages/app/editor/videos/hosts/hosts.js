angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.hosts', {
        abstract: true,
        url: '/hosts',
        templateUrl: 'app/editor/videos/hosts/hosts.html'
    });
});
