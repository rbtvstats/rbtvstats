angular.module('app.editor').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('editor.videos', {
        abstract: true,
        url: '/videos',
        templateUrl: 'app/editor/views/videos/videos.html'
    });
    $stateProvider.state('editor.videos.all', {
        url: '/',
        templateUrl: 'app/editor/views/videos/videos-all/videos-all.html'
    });
    $stateProvider.state('editor.videos.one', {
        url: '/:videoId',
        templateUrl: 'app/editor/views/videos/videos-one/videos-one.html'
    });
    $urlRouterProvider.when('/editor/videos', '/editor/videos/');
});

angular.module('app.editor').controller('VideosCtrl', function($scope, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    $scope.getRatingPercent = function(video) {
        if (video && video.stats) {
            return Math.round(100 * video.stats.likeCount / (video.stats.likeCount + video.stats.dislikeCount)) || 0;
        }

        return 0;
    };

    $scope.copy = function(video) {
        $scope.clipboard = video;
    };

    $scope.paste = function(video) {
        if ($scope.clipboard) {
            angular.copy($scope.clipboard.shows, video.shows);
            angular.copy($scope.clipboard.hosts, video.hosts);
            angular.copy($scope.clipboard.series, video.series);
            VideosSrv.save();
        }
    };

    $scope.autoAll = function(video) {
        $scope.autoHosts(video);
        $scope.autoShows(video);
        $scope.autoSeries(video);
    };

    $scope.autoShows = function(video) {
        var allShows = ShowsSrv.all();
        var shows = [];
        var title = video.title;
        title = title.replace('+', 'Plus'); //FIX

        for (var i = 0; i < allShows.length; i++) {
            var show = allShows[i];
            var name = show.name.replace('+', 'Plus'); //FIX
            var re = new RegExp('\\b' + escapeRegExp(name) + '\\b', 'i');
            if (title.match(re)) {
                shows.push(show);
            }
        }

        $scope.addShow(video, shows);
    };

    $scope.autoHosts = function(video) {
        var allHosts = HostsSrv.all();
        var hosts = [];
        var title = video.title;

        for (var i = 0; i < allHosts.length; i++) {
            var host = allHosts[i];
            var re = new RegExp('\\b' + escapeRegExp(host.firstname) + '\\b', 'i');
            if (title.match(re)) {
                hosts.push(host);
            }
        }

        $scope.addHost(video, hosts);
    };

    $scope.autoSeries = function(video) {
        var allSeries = SeriesSrv.all();
        var series = [];
        var title = video.title;

        for (var i = 0; i < allSeries.length; i++) {
            var series_ = allSeries[i];
            var re = new RegExp('\\b' + escapeRegExp(series_.name) + '\\b', 'i');
            if (title.match(re)) {
                series.push(series_);
            }
        }

        $scope.addSeries(video, series);
    };

    $scope.videoChanged = function(video) {
        $scope.$broadcast('video.changed', video);
    };

    $scope.videoChangedListener = function(listener) {
        $scope.$on('video.changed', listener);
    };

    $scope.delete = function(video) {
        VideosSrv.delete({ id: video.id });
        VideosSrv.save();
    };

    $scope.addShow = function(video, shows) {
        VideosSrv.addShow(video, shows);
        VideosSrv.save();
        $scope.videoChanged(video);
    };

    $scope.removeShow = function(video, shows) {
        VideosSrv.removeShow(video, shows);
        VideosSrv.save();
        $scope.videoChanged(video);
    };

    $scope.addHost = function(video, hosts) {
        VideosSrv.addHost(video, hosts);
        VideosSrv.save();
        $scope.videoChanged(video);
    };

    $scope.removeHost = function(video, hosts) {
        VideosSrv.removeHost(video, hosts);
        VideosSrv.save();
        $scope.videoChanged(video);
    };

    $scope.addSeries = function(video, series) {
        VideosSrv.addSeries(video, series);
        VideosSrv.save();
        $scope.videoChanged(video);
    };

    $scope.removeSeries = function(video, series) {
        VideosSrv.removeSeries(video, series);
        VideosSrv.save();
        $scope.videoChanged(video);
    };
});
