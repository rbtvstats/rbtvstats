angular.module('app.viewer').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('viewer.channels', {
        abstract: true,
        url: '/channels',
        templateUrl: 'app/viewer/views/channels/channels.html'
    });
    $urlRouterProvider.when('/channels', '/channels/');
});
