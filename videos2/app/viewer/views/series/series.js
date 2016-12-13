angular.module('app.viewer').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('viewer.series', {
        abstract: true,
        url: '/series',
        templateUrl: 'app/viewer/views/series/series.html'
    });
    $urlRouterProvider.when('/series', '/series/');
});
