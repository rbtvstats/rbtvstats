angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.series', {
        abstract: true,
        url: '/series',
        templateUrl: 'app/editor/views/series/series.html'
    });
    $stateProvider.state('editor.series.all', {
        url: '/',
        templateUrl: 'app/editor/views/series/series-all/series-all.html'
    });
    $stateProvider.state('editor.series.one', {
        url: '/:seriesId',
        templateUrl: 'app/editor/views/series/series-one/series-one.html'
    });
    $urlRouterProvider.when('/editor/series', '/editor/series/');
});
