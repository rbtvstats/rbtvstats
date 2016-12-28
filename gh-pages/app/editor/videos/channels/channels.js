angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.channels', {
        abstract: true,
        url: '/channels',
        templateUrl: 'app/editor/videos/channels/channels.html'
    });
});
