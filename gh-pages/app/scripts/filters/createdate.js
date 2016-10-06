'use strict';

/**
 * @ngdoc filter
 * @name rbtvstatsApp.filter:createDate
 * @function
 * @description
 * # createDate
 * Filter in the rbtvstatsApp.
 */
app.filter('createDate', function() {
    return function(seconds) {
        return new Date(seconds * 1000);
    }
});
