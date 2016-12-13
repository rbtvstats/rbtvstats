angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.shows', {
        abstract: true,
        url: '/shows',
        templateUrl: 'app/editor/views/shows/shows.html'
    });
    $urlRouterProvider.when('/editor/shows', '/editor/shows/');
});
