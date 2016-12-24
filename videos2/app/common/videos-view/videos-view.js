angular.module('app.common').directive('videosView', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            videos: '=videosView',
            mode: '=videosMode'
        },
        templateUrl: 'app/common/videos-view/videos-view.html',
        controller: function($scope, NgTableParams, StateSrv, VideosExtractorSrv, VideosSrv) {
            $scope.init = function() {
                //import from parent scope
                $scope.imagePlaceholders = $scope.$parent.imagePlaceholders;

                //table
                $scope.table = {
                    params: new NgTableParams({
                        filter: { $: 'a' }
                    }, {
                        dataset: $scope.videos,
                        counts: [],
                        filterOptions: {
                            filterFn: function(videos) {
                                if (!$scope.videosCache) {
                                    $scope.videosCache = VideosSrv.filter(videos, $scope.table.options.filter);
                                }

                                return $scope.videosCache;
                            }
                        }
                    }),
                    options: {},
                    tableHidden: true,
                    optionsHidden: true
                };

                //defer visibility for smoother UI
                $timeout(function() {
                    $scope.table.tableHidden = false;
                }, 100);

                $scope.$on('video.changed', function(video) {
                    $scope.clearVideosCache();
                    VideosSrv.save();
                });

                StateSrv.watch($scope, ['table.options']);
            };

            $scope.getRatingPercent = function(video) {
                if (video && video.stats) {
                    return Math.round(100 * video.stats.likeCount / (video.stats.likeCount + video.stats.dislikeCount)) || 0;
                }

                return 0;
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

            $scope.videoChanged = function(video) {
                $scope.$broadcast('video.changed', video);
            };

            $scope.extractAll = function(video) {
                VideosExtractorSrv.extractShows(video);
                VideosExtractorSrv.extractHosts(video);
                VideosExtractorSrv.extractSeries(video);
            };

            $scope.extractShows = function(video) {
                VideosExtractorSrv.extractShows(video);
                VideosSrv.save();
            };

            $scope.extractHosts = function(video) {
                VideosExtractorSrv.extractHosts(video);
                VideosSrv.save();
            };

            $scope.extractSeries = function(video) {
                VideosExtractorSrv.extractSeries(video);
                VideosSrv.save();
            };

            $scope.copy = function(video) {
                $scope.clipboard = video;
            };

            $scope.paste = function(video) {
                if ($scope.clipboard) {
                    angular.copy($scope.clipboard.shows, video.shows);
                    angular.copy($scope.clipboard.hosts, video.hosts);
                    angular.copy($scope.clipboard.series, video.series);
                    $scope.videoChanged(video);
                }
            };

            $scope.delete = function(video) {
                VideosSrv.delete({ id: video.id });
                $scope.videoChanged(video);
            };

            $scope.addShow = function(video, shows) {
                VideosSrv.addShow(video, shows);
                $scope.videoChanged(video);
            };

            $scope.removeShow = function(video, shows) {
                VideosSrv.removeShow(video, shows);
                $scope.videoChanged(video);
            };

            $scope.addHost = function(video, hosts) {
                VideosSrv.addHost(video, hosts);
                $scope.videoChanged(video);
            };

            $scope.removeHost = function(video, hosts) {
                VideosSrv.removeHost(video, hosts);
                $scope.videoChanged(video);
            };

            $scope.addSeries = function(video, series) {
                VideosSrv.addSeries(video, series);
                $scope.videoChanged(video);
            };

            $scope.removeSeries = function(video, series) {
                VideosSrv.removeSeries(video, series);
                $scope.videoChanged(video);
            };

            $scope.clearVideosCache = function() {
                $scope.videosCache = null;
            };

            $scope.update = function() {
                $scope.table.params.reload();
            };

            $scope.init();
        }
    };
});
