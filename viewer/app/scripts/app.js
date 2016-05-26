'use strict';

/**
 * @ngdoc overview
 * @name rbtvstatsApp
 * @description
 * # rbtvstatsApp
 *
 * Main module of the application.
 */
var app = angular.module('rbtvstatsApp', [
    'ngRoute',
    'ngTable',
    'chart.js',
    'ui.select'
]);

app.config(function($routeProvider, ChartJsProvider) {
    $routeProvider
    .when('/channels', {
        templateUrl: 'views/channels.html',
        controller: 'ChannelsCtrl'
    })
    .when('/hosts', {
        templateUrl: 'views/hosts.html',
        controller: 'HostsCtrl'
    })
    .when('/videos', {
        templateUrl: 'views/videos.html',
        controller: 'VideosCtrl'
    })
    .when('/shows', {
        templateUrl: 'views/shows.html',
        controller: 'ShowsCtrl'
    }).
    otherwise({
        redirectTo: '/channels'
    });

    ChartJsProvider.setOptions({
        responsive: true,
        maintainAspectRatio: false
    });
});
