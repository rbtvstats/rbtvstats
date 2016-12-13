angular.module('app.viewer').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('viewer.shows', {
        abstract: true,
        url: '/shows',
        templateUrl: 'app/viewer/views/shows/shows.html'
    });
    $urlRouterProvider.when('/shows', '/shows/');
});
