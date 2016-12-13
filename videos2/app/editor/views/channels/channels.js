angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.channels', {
        abstract: true,
        url: '/channels',
        templateUrl: 'app/editor/views/channels/channels.html'
    });
    $urlRouterProvider.when('/editor/channels', '/editor/channels/');
});
