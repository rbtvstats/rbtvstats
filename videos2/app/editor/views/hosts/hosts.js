angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.hosts', {
        abstract: true,
        url: '/hosts',
        templateUrl: 'app/editor/views/hosts/hosts.html'
    });
    $urlRouterProvider.when('/editor/hosts', '/editor/hosts/');
});
