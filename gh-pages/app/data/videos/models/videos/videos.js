angular.module('app.data.videos').service('VideosSrv', function($filter, $q, DataBaseCtrl, ShowsSrv, YoutubeApiSrv) {
    DataBaseCtrl.call(this);

    var self = this;

    this.id = 'videos';
    this.name = 'Videos';
    this.schema = {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                default: ''
            },
            title: {
                type: 'string',
                default: ''
            },
            published: {
                type: 'number',
                allowNull: true,
                default: null
            },
            aired: {
                type: 'number',
                allowNull: true,
                default: null
            },
            duration: {
                type: 'number',
                default: 0
            },
            channel: {
                type: '$channels',
                default: null
            },
            shows: {
                type: 'array',
                arrayType: {
                    type: '$shows',
                },
                default: []
            },
            hosts: {
                type: 'array',
                arrayType: {
                    type: '$hosts',
                },
                default: []
            },
            series: {
                type: 'array',
                arrayType: {
                    type: '$series',
                },
                default: []
            },
            stats: {
                type: 'object',
                properties: {
                    commentCount: {
                        type: 'number',
                        allowNull: true,
                        default: null
                    },
                    viewCount: {
                        type: 'number',
                        allowNull: true,
                        default: null
                    },
                    dislikeCount: {
                        type: 'number',
                        allowNull: true,
                        default: null
                    },
                    likeCount: {
                        type: 'number',
                        allowNull: true,
                        default: null
                    }
                }
            },
            online: {
                type: 'boolean',
                default: false
            }
        }
    };

    function containsOne(arr1, arr2) {
        return _.some(arr2, function(v) {
            return arr1.indexOf(v) >= 0;
        });
    }

    function containsAll(arr1, arr2) {
        return _.every(arr2, function(v) {
            return arr1.indexOf(v) >= 0;
        });
    }

    this.addShow = function(video, shows) {
        if (!angular.isArray(shows)) {
            shows = [shows];
        }

        video.shows = video.shows || [];
        var count = 0;
        for (var i = 0; i < shows.length; i++) {
            var show = shows[i];
            if (video.shows.indexOf(show.id) === -1) {
                video.shows.push(show.id);
                count++;
            }
        }

        return count;
    };

    this.removeShow = function(video, shows) {
        if (!angular.isArray(shows)) {
            shows = [shows];
        }

        video.shows = video.shows || [];
        var count = 0;
        for (var i = 0; i < shows.length; i++) {
            var show = shows[i];
            var index = video.shows.indexOf(show.id);
            if (index > -1) {
                video.shows.splice(index, 1);
                count++;
            }
        }

        return count;
    };

    this.addHost = function(video, hosts) {
        if (!angular.isArray(hosts)) {
            hosts = [hosts];
        }

        video.hosts = video.hosts || [];
        var count = 0;
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            if (video.hosts.indexOf(host.id) === -1) {
                video.hosts.push(host.id);
                count++;
            }
        }

        return count;
    };

    this.removeHost = function(video, hosts) {
        if (!angular.isArray(hosts)) {
            hosts = [hosts];
        }

        video.hosts = video.hosts || [];
        var count = 0;
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            var index = video.hosts.indexOf(host.id);
            if (index > -1) {
                video.hosts.splice(index, 1);
                count++;
            }
        }

        return count;
    };

    this.addSeries = function(video, series) {
        if (!angular.isArray(series)) {
            series = [series];
        }

        video.series = video.series || [];
        var count = 0;
        for (var i = 0; i < series.length; i++) {
            var series_ = series[i];
            if (video.series.indexOf(series_.id) === -1) {
                video.series.push(series_.id);
                count++;
            }
        }

        return count;
    };

    this.removeSeries = function(video, series) {
        if (!angular.isArray(series)) {
            series = [series];
        }

        video.series = video.series || [];
        var count = 0;
        for (var i = 0; i < series.length; i++) {
            var series_ = series[i];
            var index = video.series.indexOf(series_.id);
            if (index > -1) {
                video.series.splice(index, 1);
                count++;
            }
        }

        return count;
    };

    this.filter = function(videos, filter) {
        if (!angular.isObject(filter)) {
            filter = {};
        }

        var filterTitle = false;
        var filterChannels = false;
        var filterShows = false;
        var filterHosts = false;
        var filterSeries = false;
        var filterDurationStart = false;
        var filterDurationEnd = false;
        var filterPublishedStart = false;
        var filterPublishedEnd = false;
        var filterAiredStart = false;
        var filterAiredEnd = false;
        var filterEvent = false;
        var filterNoShow = false;
        var filterNoHost = false;
        var filterNoSeries = false;
        var filterOnline = false;
        var filterValid = false;

        //title
        var title;
        if (angular.isObject(filter.title)) {
            if (angular.isString(filter.title.text)) {
                filterTitle = true;

                if (filter.title.regex) {
                    title = new RegExp(filter.title.text, filter.title.sensitive ? '' : 'i');
                } else if (filter.title.sensitive) {
                    title = filter.title.text;
                } else {
                    title = filter.title.text.toLowerCase();
                }
            }
        }

        //channels
        if (angular.isObject(filter.channels)) {
            if (angular.isArray(filter.channels.filter)) {
                filterChannels = filter.channels.filter.length > 0;
            }
        }

        //shows
        if (angular.isObject(filter.shows)) {
            if (angular.isArray(filter.shows.filter)) {
                filterShows = filter.shows.filter.length > 0;
            }
        }

        //hosts
        if (angular.isObject(filter.hosts)) {
            if (angular.isArray(filter.hosts.filter)) {
                filterHosts = filter.hosts.filter.length > 0;
            }
        }

        //series
        if (angular.isObject(filter.series)) {
            if (angular.isArray(filter.series.filter)) {
                filterSeries = filter.series.filter.length > 0;
            }
        }

        //duration
        if (angular.isObject(filter.duration)) {
            filterDurationStart = angular.isNumber(filter.duration.start) && filter.duration.start > 0;
            filterDurationEnd = angular.isNumber(filter.duration.end) && filter.duration.end > 0;
        }

        var secondsThreshold = 2524608000;

        //published
        var publishedStart = 0;
        var publishedEnd = 0;
        if (angular.isObject(filter.published)) {
            if (angular.isNumber(filter.published.start) && filter.published.start > 0) {
                if (filter.published.start >= secondsThreshold) { //assume timestamp is milliseconds
                    publishedStart = filter.published.start / 1000;
                } else {
                    publishedStart = filter.published.start;
                }
                filterPublishedStart = true;
            } else if (moment.isMoment(filter.published.start)) {
                publishedStart = publishedStart.unix();
                filterPublishedStart = true;
            } else if (angular.isDate(filter.published.start)) {
                publishedStart = publishedStart.getTime() / 1000;
                filterPublishedStart = true;
            }

            if (angular.isNumber(filter.published.end) && filter.published.end > 0) {
                if (filter.published.end >= secondsThreshold) { //assume timestamp is milliseconds
                    publishedEnd = filter.published.end / 1000;
                } else {
                    publishedEnd = filter.published.end;
                }
                filterPublishedEnd = true;
            } else if (moment.isMoment(filter.published.end)) {
                publishedEnd = publishedEnd.unix();
                filterPublishedEnd = true;
            } else if (angular.isDate(filter.published.end)) {
                publishedEnd = publishedEnd.getTime() / 1000;
                filterPublishedEnd = true;
            }
        }

        //aired
        var airedStart = 0;
        var airedEnd = 0;
        if (angular.isObject(filter.aired)) {
            if (angular.isNumber(filter.aired.start) && filter.aired.start > 0) {
                if (filter.aired.start >= secondsThreshold) { //assume timestamp is milliseconds
                    airedStart = filter.aired.start / 1000;
                } else {
                    airedStart = filter.aired.start;
                }
                filterAiredStart = true;
            } else if (moment.isMoment(filter.aired.start)) {
                airedStart = airedStart.unix();
                filterAiredStart = true;
            } else if (angular.isDate(filter.aired.start)) {
                airedStart = airedStart.getTime() / 1000;
                filterAiredStart = true;
            }

            if (angular.isNumber(filter.aired.end) && filter.aired.end > 0) {
                if (filter.aired.end >= secondsThreshold) { //assume timestamp is milliseconds
                    airedEnd = filter.aired.end / 1000;
                } else {
                    airedEnd = filter.aired.end;
                }
                filterAiredEnd = true;
            } else if (moment.isMoment(filter.aired.end)) {
                airedEnd = airedEnd.unix();
                filterAiredEnd = true;
            } else if (angular.isDate(filter.aired.end)) {
                airedEnd = airedEnd.getTime() / 1000;
                filterAiredEnd = true;
            }
        }

        //event
        var showsEvent;
        var filterEventComp;
        filterEvent = angular.isBoolean(filter.event);
        if (filterEvent) {
            showsEvent = ShowsSrv.find({ event: true });
            showsEvent = _.map(showsEvent, 'id');
            filterEventComp = function(show) {
                return showsEvent.indexOf(show) !== -1;
            };
        }

        //noShow
        filterNoShow = angular.isBoolean(filter.noShow);

        //noHost
        filterNoHost = angular.isBoolean(filter.noHost);

        //noSeries
        filterNoSeries = angular.isBoolean(filter.noSeries);

        //online
        filterOnline = angular.isBoolean(filter.online);

        //valid
        filterValid = angular.isBoolean(filter.valid);

        var result = [];
        for (var i = 0; i < videos.length; i++) {
            var match = true;
            var video = videos[i];

            //title
            if (match && filterTitle) {
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
            if (match && filterChannels) {
                match = containsOne([video.channel], filter.channels.filter);
            }

            //shows
            if (match && filterShows) {
                if (filter.shows.match === 'and') {
                    match = containsAll(video.shows, filter.shows.filter);
                } else {
                    match = containsOne(video.shows, filter.shows.filter);
                }
            }

            //hosts
            if (match && filterHosts) {
                if (filter.hosts.match === 'and') {
                    match = containsAll(video.hosts, filter.hosts.filter);
                } else {
                    match = containsOne(video.hosts, filter.hosts.filter);
                }
            }

            //series
            if (match && filterSeries) {
                if (filter.series.match === 'and') {
                    match = containsAll(video.series, filter.series.filter);
                } else {
                    match = containsOne(video.series, filter.series.filter);
                }
            }

            //duration
            if (match && filterDurationStart) {
                match = video.duration >= filter.duration.start;
            }

            if (match && filterDurationEnd) {
                match = video.duration <= filter.duration.end;
            }

            //published
            if (match && filterPublishedStart) {
                match = video.published >= publishedStart;
            }

            if (match && filterPublishedEnd) {
                match = video.published <= publishedEnd;
            }

            //aired
            if (match && filterAiredStart) {
                match = video.aired >= airedStart;
            }

            if (match && filterAiredEnd) {
                match = video.aired <= airedEnd;
            }

            //event
            if (match && filterEvent) {
                match = _.some(video.shows, filterEventComp);

                if (!filter.event) {
                    match = !match;
                }
            }

            //noShow
            if (match && filterNoShow) {
                match = video.shows.length === 0;

                if (!filter.noShow) {
                    match = !match;
                }
            }

            //noHost
            if (match && filterNoHost) {
                match = video.hosts.length === 0;

                if (!filter.noHost) {
                    match = !match;
                }
            }

            //noSeries
            if (match && filterNoSeries) {
                match = video.series.length === 0;

                if (!filter.noSeries) {
                    match = !match;
                }
            }

            //online
            if (match && filterOnline) {
                match = video.online;

                if (!filter.online) {
                    match = !match;
                }
            }

            //valid
            if (match && filterValid) {
                match = self.isValid(video);

                if (!filter.valid) {
                    match = !match;
                }
            }

            //invert
            if (filter.invert === true) {
                match = !match;
            }

            if (match) {
                result.push(video);
            }
        }

        return result;
    };

    this.groupBy = function(videos, target) {
        return _(videos)
            .groupBy(target)
            .map(function(videos, target) {
                return {
                    target: target,
                    videos: videos
                };
            })
            .value();
    };

    this.groupByBuckets = function(videos, target, targetDistribution, bucketSize) {
        targetDistribution = _.iteratee(targetDistribution);

        var multiGroup = angular.isString(target) || angular.isFunction(target);
        var result = videos;

        //======================================================
        //dimension 1: group videos by target (optional)
        //e.g. group all videos by 'channel'
        if (multiGroup) {
            result = self.groupBy(result, target);
        } else {
            result = [{
                target: null,
                videos: videos
            }];
        }

        //======================================================
        //dimension 2: group videos by buckets of target group
        //e.g. group all videos of a 'channel' by 'views' in buckets of size 2000
        var bucketsAll = [];
        result = _.map(result, function(data) {
            data.videos = _(data.videos)
                .groupBy(function(video) {
                    return Math.floor(targetDistribution(video) / bucketSize) * bucketSize;
                })
                .map(function(videos, bucket) {
                    bucket = parseInt(bucket);
                    bucketsAll.push(bucket);

                    return { bucket: bucket, videos: videos };
                })
                .value();

            return data;
        });

        bucketsAll = _.uniq(bucketsAll);

        //======================================================
        //fill in possible missing buckets so all target groups will have the same buckets (with possible empty arrays)
        result = _.map(result, function(data) {
            var buckets = _.map(data.videos, function(data) {
                return data.bucket;
            });

            _.each(bucketsAll, function(bucket) {
                if (buckets.indexOf(bucket) === -1) {
                    data.videos.push({ bucket: bucket, videos: [] });
                }
            });

            //order videos
            data.videos = _(data.videos)
                .orderBy(function(data) {
                    return data.bucket;
                })
                .value();

            return data;
        });

        //======================================================
        //order videos
        result = _.map(result, function(data) {
            data.videos = _(data.videos)
                .orderBy(function(data) {
                    return data.bucket;
                })
                .value();

            return data;
        });

        return result;
    };

    var DateGroupHelper = {};
    var weekStartMonday = [6, 0, 1, 2, 3, 4, 5];
    DateGroupHelper.week = function(video) {
        var published = new Date(video.published * 1000);
        published.setMilliseconds(0);
        published.setSeconds(0);
        published.setMinutes(0);
        published.setHours(0);
        published.setDate(published.getDate() - weekStartMonday[published.getDay()]);

        return Math.round(published.getTime() / 1000);
    };

    DateGroupHelper.month = function(video) {
        var published = new Date(video.published * 1000);

        published.setMilliseconds(0);
        published.setSeconds(0);
        published.setMinutes(0);
        published.setHours(0);
        published.setDate(1);

        return Math.round(published.getTime() / 1000);
    };

    DateGroupHelper.quarter = function(video) {
        var published = new Date(video.published * 1000);
        published.setMilliseconds(0);
        published.setSeconds(0);
        published.setMinutes(0);
        published.setHours(0);
        published.setDate(1);
        published.setMonth(Math.floor(published.getMonth() / 3) * 3);

        return Math.round(published.getTime() / 1000);
    };

    this.groupByDate = function(videos, target, targetDate) {
        if (angular.isString(targetDate)) {
            targetDate = DateGroupHelper[targetDate];
        }

        var multiGroup = angular.isString(target) || angular.isFunction(target);
        var result = videos;

        //======================================================
        //dimension 1: group videos by target (optional)
        //e.g. group all videos by 'channel'
        if (multiGroup) {
            result = self.groupBy(result, target);
        } else {
            result = [{
                target: null,
                videos: videos
            }];
        }

        //======================================================
        //dimension 2: group videos by date of target group
        //e.g. group all videos of a 'channel' by dates
        var datesAll = [];
        result = _.map(result, function(data) {
            data.videos = _(data.videos)
                .groupBy(targetDate)
                .map(function(videos, date) {
                    date = parseInt(date);
                    datesAll.push(date);

                    return { date: date, videos: videos };
                })
                .value();

            return data;
        });

        //======================================================
        //fill in possible missing dates so all target groups will have the same dates (with possible empty arrays)
        datesAll = _.uniq(datesAll);

        result = _.map(result, function(data) {
            var dates = _.map(data.videos, function(data) {
                return data.date;
            });

            _.each(datesAll, function(date) {
                if (dates.indexOf(date) === -1) {
                    data.videos.push({ date: date, videos: [] });
                }
            });

            return data;
        });

        //======================================================
        //order data
        result = _.map(result, function(data) {
            data.videos = _(data.videos)
                .orderBy(function(data) {
                    return data.date;
                })
                .value();

            return data;
        });

        return result;
    };

    return this;
});

registerVideoDataService('videos', 'VideosSrv');
