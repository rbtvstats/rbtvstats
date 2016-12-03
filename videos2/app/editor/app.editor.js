angular.module('app.editor', ['ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'app.common',
    'app.data',
    'app.editor.utils',
    'ngTable',
    'ui.select',
    'youtube-embed',
    'angular-md5'
]);

angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor', {
        abstract: true,
        url: '/editor',
        templateUrl: 'app/editor/app.editor.html'
    });
    $urlRouterProvider.when('/editor', '/editor/channels/');
    $urlRouterProvider.otherwise('/editor');
});
