angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.export', {
        url: '/export/',
        templateUrl: 'app/editor/views/export/export.html'
    });
    $urlRouterProvider.when('/editor/export', '/editor/export/');
});

angular.module('app.editor').controller('ExportCtrl', function($scope, $filter, $timeout, StateSrv, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
    $scope.init = function() {
        $scope.videos = VideosSrv.all();
        $scope.formats = [{
            name: 'Version 1',
            export: $scope.exportV1
        }, {
            name: 'Version 2',
            export: $scope.exportV2
        }];
        $scope.filterPublishedOptions = {
            singleDatePicker: true
        };
        $scope.exportOptions = {
            format: $scope.formats[0],
            filterPublished: {
                start: moment(new Date(2015, 2, 3)),
                end: 0
            },
            filterValid: true,
            filterOnline: true
        };

        StateSrv.watch($scope, ['exportOptions']);
    };

    $scope.applyFilter = function() {
        var videos = [];

        for (var i = 0; i < $scope.videos.length; i++) {
            var match = true;
            var video = $scope.videos[i];

            //published
            if (match && $scope.exportOptions.filterPublished.start) {
                match = false;
                var timestamp = $scope.exportOptions.filterPublished.start.unix();

                match = video.published >= timestamp;
            }

            if (match && $scope.exportOptions.filterPublished.end) {
                match = false;
                var timestamp = $scope.exportOptions.filterPublished.end.unix();

                match = video.published <= timestamp;
            }

            //valid
            if (match && $scope.exportOptions.filterValid) {
                match = VideosSrv.isValid(video);
            }

            //online
            if (match && $scope.exportOptions.filterOnline) {
                match = video.online;
            }

            if (match) {
                videos.push(video);
            }
        }

        return videos;
    };

    $scope.exportV1 = function(videos) {
        var data = [];
        var videosGrouped = {};

        videos = $filter('orderBy')(videos, 'published');

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var published = new Date(video.published * 1000);
            var month = published.getMonth() + 1;
            var id = published.getFullYear() + '-' + ((month < 10) ? ('0' + month) : month);

            videosGrouped[id] = videosGrouped[id] || [];
            videosGrouped[id].push(video);
        }

        for (var date in videosGrouped) {
            var str = JSON.stringify(videosGrouped[date], function(key, value) {
                if (key === 'channel') {
                    var channel = ChannelsSrv.findById(value);
                    if (channel) {
                        return channel.title;
                    }
                } else if (key === 'shows') {
                    var shows = [];
                    for (var i = 0; i < value.length; i++) {
                        var showId = value[i];
                        var show = ShowsSrv.findById(showId);
                        if (show) {
                            shows.push(show.name);
                        }
                    }

                    return shows;
                } else if (key === 'hosts') {
                    var hosts = [];
                    for (var i = 0; i < value.length; i++) {
                        var hostId = value[i];
                        var host = HostsSrv.findById(hostId);
                        if (host) {
                            hosts.push(host.firstname);
                        }
                    }

                    return hosts;
                } else if (key === 'series') {
                    var series = [];
                    for (var i = 0; i < value.length; i++) {
                        var seriesId = value[i];
                        var series_ = SeriesSrv.findById(seriesId);
                        if (series_) {
                            series.push(series_.name);
                        }
                    }

                    return series;
                } else if (key === 'online') {
                    return;
                }

                return value;
            }, '\t');

            data.push({
                filename: date + '.json',
                content: str
            });
        }

        var time = parseInt(new Date().getTime() / 1000, 10);
        var first = videos[0].published;
        var last = videos[videos.length - 1].published;
        var metadata = {
            time: time,
            first: first,
            last: last
        }

        var str = JSON.stringify(metadata, null, '\t');
        data.push({
            filename: 'metadata.json',
            content: str
        });

        return data;
    };

    $scope.exportV2 = function() {
        return [];
    };

    $scope.export = function() {
        var videos = $scope.applyFilter();
        var data = $scope.exportOptions.format.export(videos);

        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var file = new File([d.content], d.filename, { type: 'text/plain;charset=utf-8' });
            saveAs(file);
        }
    };

    $scope.init();
});
