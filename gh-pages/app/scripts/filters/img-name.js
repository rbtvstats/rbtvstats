'use strict';

/**
 * @ngdoc filter
 * @name rbtvstatsApp.filter:imgName
 * @function
 * @description
 * # imgName
 * Filter in the rbtvstatsApp.
 */
app.filter('imgName', function(md5) {
    return function(input) {
        if (input) {
            input = input.replace(/ä|Ä|ö|Ö|ü|Ü|ß/g, '_');
            return md5.createHash(input);
        }
    };
});
