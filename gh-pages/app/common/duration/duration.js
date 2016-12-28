angular.module('app.common').filter('duration', function() {
    return function(duration) {
        var days = Math.floor(duration / 86400);
        var hours = Math.floor((duration % 86400) / 3600);
        var minutes = Math.floor(((duration % 86400) % 3600) / 60);
        var seconds = Math.floor((((duration % 86400) % 3600) % 60));
        var timeStr = '';
        if (days > 0) {
            timeStr += days + "T ";
        }
        if (hours > 0) {
            timeStr += hours + "h ";
        }
        if (minutes > 0) {
            timeStr += minutes + "m ";
        }
        if (seconds > 0 && days === 0 && hours === 0) {
            timeStr += seconds + "s ";
        }

        return timeStr;
    };
});
