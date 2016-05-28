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
    'ui.select',
    'angular-loading-bar',
    'duScroll'
]);

app.config(function($routeProvider, ChartJsProvider, cfpLoadingBarProvider) {
    $routeProvider
    .when('/channels', {
        templateUrl: 'views/channels.html',
        controller: 'ChannelsCtrl'
    })
    .when('/shows/:show?', {
        templateUrl: 'views/shows.html',
        controller: 'ShowsCtrl'
    })
    .when('/hosts', {
        templateUrl: 'views/hosts.html',
        controller: 'HostsCtrl',
        reloadOnSearch: false
    })
    .when('/videos', {
        templateUrl: 'views/videos.html',
        controller: 'VideosCtrl'
    })
    .otherwise({
        redirectTo: '/channels'
    });

    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;

    ChartJsProvider.setOptions({
        responsive: true,
        maintainAspectRatio: false
    });
});
