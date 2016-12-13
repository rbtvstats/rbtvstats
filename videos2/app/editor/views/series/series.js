angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.series', {
        abstract: true,
        url: '/series',
        templateUrl: 'app/editor/views/series/series.html'
    });
    $urlRouterProvider.when('/editor/series', '/editor/series/');
});
