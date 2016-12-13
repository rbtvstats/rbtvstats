angular.module('app.viewer').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('viewer.hosts', {
        abstract: true,
        url: '/hosts',
        templateUrl: 'app/viewer/views/hosts/hosts.html'
    });
    $urlRouterProvider.when('/hosts', '/hosts/');
});
