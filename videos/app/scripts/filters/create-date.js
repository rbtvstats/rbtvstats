'use strict';

/**
 * @ngdoc filter
 * @name rbtvCrawlerApp.filter:createDate
 * @function
 * @description
 * # createDate
 * Filter in the rbtvCrawlerApp.
 */
app.filter('createDate', function() {
    return function(seconds) {
        if (seconds) {
            return new Date(seconds * 1000);
        }
    };
});
