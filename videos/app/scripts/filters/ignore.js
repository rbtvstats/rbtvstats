'use strict';

/**
 * @ngdoc filter
 * @name rbtvstatsApp.filter:ignore
 * @function
 * @description
 * # ignore
 * Filter in the rbtvstatsApp.
 */
app.filter('ignore', function() {
    return function(videos, enable) {
        var videosFiltered;
        if (enable) {
            videosFiltered = [];
            for (var i = 0; i < videos.length; i++) {
                var video = videos[i];
                if (video.snippet.metadata.ignore) {
                    videosFiltered.push(video);
                }
            }
        } else {
            videosFiltered = videos
        }

        return videosFiltered;
    };
});
