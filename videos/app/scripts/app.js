'use strict';

/**
 * @ngdoc overview
 * @name rbtvCrawlerApp
 * @description
 * # rbtvCrawlerApp
 *
 * Main module of the application.
 */
var app = angular.module('app', [
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap',
    'ui.select',
    'uuid4',
    'LocalStorageModule',
    'ngTable',
    'daterangepicker',
    'ng.jsoneditor'
]);

app.config(function($routeProvider) {
    $routeProvider
        .when('/videos', {
            templateUrl: 'views/videos.html',
            controller: 'VideosCtrl'
        })
        .when('/channels', {
            templateUrl: 'views/channels.html',
            controller: 'ChannelsCtrl'
        })
        .when('/shows', {
            templateUrl: 'views/shows.html',
            controller: 'ShowsCtrl'
        })
        .when('/hosts', {
            templateUrl: 'views/hosts.html',
            controller: 'HostsCtrl'
        })
        .when('/series', {
            templateUrl: 'views/series.html',
            controller: 'SeriesCtrl'
        })
        .when('/schemas', {
            templateUrl: 'views/schemas.html',
            controller: 'SchemasCtrl'
        })
        .when('/import-export', {
            templateUrl: 'views/import-export.html',
            controller: 'ImportExportCtrl'
        })
        .when('/config', {
            templateUrl: 'views/config.html',
            controller: 'ConfigCtrl'
        })
        .otherwise({
            redirectTo: '/videos'
        });
});

app.run(function(DataControllerSrv) {
    DataControllerSrv.init();
});
