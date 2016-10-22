'use strict';

/**
 * @ngdoc filter
 * @name rbtvstatsApp.filter:noHost
 * @function
 * @description
 * # noHost
 * Filter in the rbtvstatsApp.
 */
app.filter('noHost', function() {
    return function(videos, enable, lastEdited) {
        var videosFiltered;
        if (enable) {
            videosFiltered = [];
            for (var i = 0; i < videos.length; i++) {
                var video = videos[i];
                if (!video.snippet.metadata.ignore) {
                    if (typeof lastEdited === 'object' && lastEdited) {
                        if (lastEdited.id == video.id) {
                            videosFiltered.push(video);
                            continue;
                        }
                    }
                    if (!video.snippet.metadata.hosts || video.snippet.metadata.hosts.length == 0) {
                        videosFiltered.push(video);
                    }
                }
            }
        } else {
            videosFiltered = videos
        }

        return videosFiltered;
    };
});
