angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos', {
        abstract: true,
        url: '/videos',
        template: '<div ui-view></div>'
    });
});
