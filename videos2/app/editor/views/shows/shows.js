angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.shows', {
        abstract: true,
        url: '/shows',
        templateUrl: 'app/editor/views/shows/shows.html'
    });
    $stateProvider.state('editor.shows.all', {
        url: '/',
        templateUrl: 'app/editor/views/shows/shows-all/shows-all.html'
    });
    $stateProvider.state('editor.shows.one', {
        url: '/:showId',
        templateUrl: 'app/editor/views/shows/shows-one/shows-one.html'
    });
    $urlRouterProvider.when('/editor/shows', '/editor/shows/');
});
