angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.channels', {
        abstract: true,
        url: '/channels',
        templateUrl: 'app/editor/views/channels/channels.html'
    });
    $stateProvider.state('editor.channels.all', {
        url: '/',
        templateUrl: 'app/editor/views/channels/channels-all/channels-all.html'
    });
    $stateProvider.state('editor.channels.one', {
        url: '/:channelId',
        templateUrl: 'app/editor/views/channels/channels-one/channels-one.html'
    });
    $urlRouterProvider.when('/editor/channels', '/editor/channels/');
});
