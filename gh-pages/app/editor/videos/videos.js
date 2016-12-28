angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos', {
        abstract: true,
        url: '/videos',
        template: '<div ui-view></div>'
    });
});
