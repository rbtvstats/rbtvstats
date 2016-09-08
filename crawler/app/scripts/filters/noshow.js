'use strict';

/**
 * @ngdoc filter
 * @name rbtvstatsApp.filter:noShow
 * @function
 * @description
 * # noShow
 * Filter in the rbtvstatsApp.
 */
app.filter('noShow', function() {
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
                    if (!video.snippet.metadata.shows || video.snippet.metadata.shows.length == 0) {
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
