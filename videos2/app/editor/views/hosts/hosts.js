angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.hosts', {
        abstract: true,
        url: '/hosts',
        templateUrl: 'app/editor/views/hosts/hosts.html'
    });
    $stateProvider.state('editor.hosts.all', {
        url: '/',
        templateUrl: 'app/editor/views/hosts/hosts-all/hosts-all.html'
    });
    $stateProvider.state('editor.hosts.one', {
        url: '/:hostId',
        templateUrl: 'app/editor/views/hosts/hosts-one/hosts-one.html'
    });
    $urlRouterProvider.when('/editor/hosts', '/editor/hosts/');
});
