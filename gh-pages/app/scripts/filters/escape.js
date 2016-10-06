'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:escape
 * @description
 * # escape
 */
app.filter('escape', function() {
    return window.encodeURIComponent;
});
