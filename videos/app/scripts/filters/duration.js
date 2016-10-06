'use strict';

/**
 * @ngdoc filter
 * @name rbtvstatsApp.filter:duration
 * @function
 * @description
 * # duration
 * Filter in the rbtvstatsApp.
 */
app.filter('duration', function() {
    return function(seconds) {
        if (typeof seconds !== 'number') {
            return '-';
        }

        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var seconds = seconds - (hours * 3600) - (minutes * 60);

        var str = '';
        if (hours > 0) { str += hours + 'h '; }
        if (minutes > 0) { str += minutes + 'm '; }
        if (seconds > 0) { str += seconds + 's '; }

        return str;
    };
});
