angular.module('app.common').directive('videosView', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            videos: '=videosView',
            mode: '=videosMode'
        },
        templateUrl: 'app/common/videos-view/videos-view.html',
        controller: function($scope, NgTableParams, InitSrv, StateSrv, VideosSrv, ShowsSrv, HostsSrv, SeriesSrv) {
            $scope.init = function() {
                //import from parent scope
                $scope.imagePlaceholders = $scope.$parent.imagePlaceholders;

                //table
                $scope.tableParams = new NgTableParams({
                    filter: { $: 'a' }
                }, {
                    dataset: $scope.videos,
                    counts: [],
                    filterOptions: {
                        filterFn: function(videos) {
                            if (!$scope.videosCache) {
                                $scope.videosCache = VideosSrv.filter(videos, $scope.tableOptions.filter);
                            }

                            return $scope.videosCache;
                        }
                    }
                });

                $scope.tableOptions = {};
                $scope.tableOptionsVisible = false;

                //delay visibility -> smoother UI
                $scope.tableParams.visible = false;
                $timeout(function() {
                    $scope.tableParams.visible = true;
                }, 50);

                $scope.$on('video.changed', function(video) {
                    $scope.clearVideosCache();
                });

                StateSrv.watch($scope, ['tableOptions']);
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

            $scope.getDuration = function(video) {
                var duration = video.duration;
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

            $scope.getHighlight = function(video) {
                return video.shows.length === 0 || video.hosts.length === 0;
            };

            $scope.getLiveFrom = function(video) {
                if (video.aired) {
                    var date = new Date(video.aired * 1000);
                    date.setHours(0, 0, 0);

                    return date.getTime() / 1000;
                }
            };

            $scope.getLiveTo = function(video) {
                if (video.aired) {
                    var date = new Date(video.aired * 1000);
                    date.setHours(23, 59, 59);

                    return date.getTime() / 1000;
                }
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

            $scope.clearVideosCache = function() {
                $scope.videosCache = null;
            };

            $scope.update = function() {
                $scope.tableParams.reload();
            };

            InitSrv.init($scope, $scope.init);
        }
    };
});
