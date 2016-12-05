angular.module('app.common').service('VideosFilterSrv', function(VideosSrv) {
    var service = {};

    function containsOne(arr1, arr2) {
        return arr2.some(function(v) {
            return arr1.indexOf(v) >= 0;
        });
    }

    function containsAll(arr1, arr2) {
        return arr2.every(function(v) {
            return arr1.indexOf(v) >= 0;
        });
    }

    service.default = function() {
        return angular.copy({
            title: {
                text: null,
                regex: false,
                sensitive: false
            },
            channels: {
                filter: []
            },
            shows: {
                filter: [],
                match: 'or'
            },
            hosts: {
                filter: [],
                match: 'or'
            },
            series: {
                filter: [],
                match: 'or'
            },
            duration: {
                start: 0,
                end: 0
            },
            published: {
                start: 0,
                end: 0
            },
            aired: {
                start: 0,
                end: 0
            },
            event: 0,
            noShow: 0,
            noHost: 0,
            noSeries: 0,
            online: 1,
            valid: 0,
            invert: false
        });
    };

    service.filter = function(videosIn, filter) {
        var videosOut = [];

        if (filter.title.text) {
            if (filter.title.regex) {
                var title = new RegExp(filter.title.text, filter.title.sensitive ? '' : 'i');
            } else if (filter.title.sensitive) {
                title = filter.title.text;
            } else {
                title = filter.title.text.toLowerCase();
            }
        }

        for (var i = 0; i < videosIn.length; i++) {
            var match = true;
            var video = videosIn[i];

            //title
            if (match && title) {
                match = false;

                if (filter.title.regex) {
                    match = title.exec(video.title) !== null;
                } else if (filter.title.sensitive) {
                    match = video.title.indexOf(title) > -1;
                } else {
                    match = video.title.toLowerCase().indexOf(title) > -1;
                }
            }

            //channels
            if (match && filter.channels.filter.length > 0) {
                match = false;

                match = containsOne([video.channel], filter.channels.filter);
            }

            //shows
            if (match && filter.shows.filter.length > 0) {
                match = false;

                if (filter.shows.match === 'and') {
                    match = containsAll(video.shows, filter.shows.filter);
                } else if (filter.shows.match === 'or') {
                    match = containsOne(video.shows, filter.shows.filter);
                }
            }

            //hosts
            if (match && filter.hosts.filter.length > 0) {
                match = false;

                if (filter.hosts.match === 'and') {
                    match = containsAll(video.hosts, filter.hosts.filter);
                } else if (filter.hosts.match === 'or') {
                    match = containsOne(video.hosts, filter.hosts.filter);
                }
            }

            //series
            if (match && filter.series.filter.length > 0) {
                match = false;

                if (filter.series.match === 'and') {
                    match = containsAll(video.series, filter.series.filter);
                } else if (filter.series.match === 'or') {
                    match = containsOne(video.series, filter.series.filter);
                }
            }

            //duration
            if (match && filter.duration.start) {
                match = false;
                var duration = filter.duration.start.getHours() * 3600 + filter.duration.start.getMinutes() * 60;

                match = video.duration >= duration;
            }

            if (match && filter.duration.end) {
                match = false;
                var duration = filter.duration.end.getHours() * 3600 + filter.duration.end.getMinutes() * 60;

                match = video.duration <= duration;
            }

            //published
            if (match && filter.published.start) {
                match = false;
                var timestamp = filter.published.start.unix();

                match = video.published >= timestamp;
            }

            if (match && filter.published.end) {
                match = false;
                var timestamp = filter.published.end.unix();

                match = video.published <= timestamp;
            }

            //aired
            if (match && filter.aired.start) {
                match = false;
                var timestamp = filter.aired.start.unix();

                match = video.aired >= timestamp;
            }

            if (match && filter.aired.end) {
                match = false;
                var timestamp = filter.aired.end.unix();

                match = video.aired <= timestamp;
            }

            //event
            if (match && filter.event === 1) {
                match = false;

                match = video.shows.join().indexOf('[E]') > -1;
            } else if (match && filter.event === 2) {
                match = false;

                match = !(video.shows.join().indexOf('[E]') > -1);
            }

            //noShow
            if (match && filter.noShow === 1) {
                match = false;

                match = video.shows.length === 0;
            } else if (match && filter.noShow === 2) {
                match = false;

                match = video.shows.length > 0;
            }

            //noHost
            if (match && filter.noHost === 1) {
                match = false;

                match = video.hosts.length === 0;
            } else if (match && filter.noHost === 2) {
                match = false;

                match = video.hosts.length > 0;
            }

            //noSeries
            if (match && filter.noSeries === 1) {
                match = false;

                match = video.series.length === 0;
            } else if (match && filter.noSeries === 2) {
                match = false;

                match = video.series.length > 0;
            }

            //online
            if (match && filter.online === 1) {
                match = false;

                match = video.online;
            } else if (match && filter.online === 2) {
                match = false;

                match = !video.online;
            }

            //valid
            if (match && filter.valid === 1) {
                match = false;

                match = VideosSrv.isValid(video);
            } else if (match && filter.valid === 2) {
                match = false;

                match = !VideosSrv.isValid(video);
            }

            //invert
            if (filter.invert === true) {
                match = !match;
            }

            if (match) {
                videosOut.push(video);
            }
        }

        return videosOut;
    };

    return service;
});
