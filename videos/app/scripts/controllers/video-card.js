'use strict';


/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:VideoCardCtrl
 * @description
 * # VideoCardCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('VideoCardCtrl', function($rootScope, $scope, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) { //ShowsSrv, HostsSrv, SeriesSrv
    $scope.init = function() {
        $scope.videos = VideosSrv.all();
        $scope.channels = ChannelsSrv.all();
        $scope.shows = ShowsSrv.all();
        $scope.hosts = HostsSrv.all();
        $scope.series = SeriesSrv.all();
        $scope.imagePlaceholders = $scope.$parent.imagePlaceholders;
        $scope.$watch('video', function(newVal, oldVal) {
            $scope.valid = VideosSrv.isValid($scope.video);

            VideosSrv.saveDelayed();
        }, true);
    };

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    $scope.getRatingPercent = function(video) {
        if (video && video.stats) {
            return Math.round(100 * video.stats.likeCount / (video.stats.likeCount + video.stats.dislikeCount)) || 0;
        }

        return 0;
    };

    $scope.showMetadata = function() {
        $scope.toolbarTooltipVisible = false;
        $scope.toolbarVisible = false;
        $scope.metadataVisible = true;
    };

    $scope.hideMetadata = function() {
        $scope.metadataVisible = false;
    };

    $scope.copy = function(video) {
        $rootScope.clipboard = video;
    };

    $scope.paste = function(video) {
        if ($rootScope.clipboard) {
            var srcVideo = $rootScope.clipboard;

            video.shows.length = 0;
            for (var i = 0; i < srcVideo.shows.length; i++) {
                video.shows.push(srcVideo.shows[i]);
            }

            video.hosts.length = 0;
            for (var i = 0; i < srcVideo.hosts.length; i++) {
                video.hosts.push(srcVideo.hosts[i]);
            }

            video.series.length = 0;
            for (var i = 0; i < srcVideo.series.length; i++) {
                video.series.push(srcVideo.series[i]);
            }
        }
    };

    $scope.remove = function(video) {
        VideosSrv.delete({ id: video.id });
        VideosSrv.save();
        $scope.update();
    };

    $scope.autoAll = function(video) {
        $scope.autoHosts(video);
        $scope.autoShows(video);
        $scope.autoSeries(video);
    };

    $scope.autoHosts = function(video) {
        var hosts = [];
        var title = video.title;

        for (var i = 0; i < $scope.hosts.length; i++) {
            var host = $scope.hosts[i];
            var re = new RegExp('\\b' + escapeRegExp(host.firstname) + '\\b', 'i');
            if (title.match(re)) {
                hosts.push(host);
            }
        }

        $scope.addHost(video, hosts);
    };

    $scope.autoShows = function(video) {
        var shows = [];
        var title = video.title;
        title = title.replace('+', 'Plus'); //FIX

        for (var i = 0; i < $scope.shows.length; i++) {
            var show = $scope.shows[i];
            var name = show.name.replace('+', 'Plus'); //FIX
            var re = new RegExp('\\b' + escapeRegExp(name) + '\\b', 'i');
            if (title.match(re)) {
                shows.push(show);
            }
        }

        $scope.addShow(video, shows);
    };

    $scope.autoSeries = function(video) {
        var series = [];
        var title = video.title;

        for (var i = 0; i < $scope.series.length; i++) {
            var series_ = $scope.series[i];
            var re = new RegExp('\\b' + escapeRegExp(series_.name) + '\\b', 'i');
            if (title.match(re)) {
                series.push(series_);
            }
        }

        $scope.addSeries(video, series);
    };

    $scope.addShow = function(video, shows) {
        if (!angular.isArray(shows)) {
            shows = [shows];
        }

        for (var i = 0; i < shows.length; i++) {
            var show = shows[i];
            if (video.shows.indexOf(show.id) === -1) {
                video.shows.push(show.id);
            }
        }
    };

    $scope.removeShow = function(video, shows) {
        if (!angular.isArray(shows)) {
            shows = [shows];
        }

        for (var i = 0; i < shows.length; i++) {
            var show = shows[i];
            var index = video.shows.indexOf(show.id);
            if (index > -1) {
                video.shows.splice(index, 1);
            }
        }
    };

    $scope.addHost = function(video, hosts) {
        if (!angular.isArray(hosts)) {
            hosts = [hosts];
        }

        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            if (video.hosts.indexOf(host.id) === -1) {
                video.hosts.push(host.id);
            }
        }
    };

    $scope.removeHost = function(video, hosts) {
        if (!angular.isArray(hosts)) {
            hosts = [hosts];
        }

        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            var index = video.hosts.indexOf(host.id);
            if (index > -1) {
                video.hosts.splice(index, 1);
            }
        }
    };

    $scope.addSeries = function(video, series) {
        if (!angular.isArray(series)) {
            series = [series];
        }

        for (var i = 0; i < series.length; i++) {
            var series_ = series[i];
            if (video.series.indexOf(series_.id) === -1) {
                video.series.push(series_.id);
            }
        }
    };

    $scope.removeSeries = function(video, series) {
        if (!angular.isArray(series)) {
            series = [series];
        }

        for (var i = 0; i < series.length; i++) {
            var series_ = series[i];
            var index = video.series.indexOf(series_.id);
            if (index > -1) {
                video.series.splice(index, 1);
            }
        }
    };

    $scope.init();
});
