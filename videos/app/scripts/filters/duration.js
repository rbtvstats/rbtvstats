'use strict';

/**
 * @ngdoc filter
 * @name rbtvCrawlerApp.filter:duration
 * @function
 * @description
 * # duration
 * Filter in the rbtvCrawlerApp.
 */
app.filter('duration', function() {
    return function(seconds) {
        var days = Math.floor(seconds / 86400);
        var hours = Math.floor((seconds % 86400) / 3600);
        var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var seconds = Math.floor((((seconds % 86400) % 3600) % 60));
        var timeString = '';
        if (days > 0) timeString += days + "T ";
        if (hours > 0) timeString += hours + "h ";
        if (minutes > 0) timeString += minutes + "m ";
        if (seconds >= 0 && days == 0 && hours == 0) timeString += seconds + "s ";
        return timeString;
    }
});
