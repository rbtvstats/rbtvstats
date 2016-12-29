angular.module('app.common').directive('videosView', function() {
    return {
        restrict: 'A',
        scope: {
            tableParams: '=videosView',
            tableOptions: '=videosViewOptions',
            videos: '=videosViewData',
            mode: '=videosViewMode',
        },
        templateUrl: 'app/common/videos-view/videos-view.html',
        controller: function($scope, $timeout, NgTableParams, VideosExtractorSrv, VideosSrv) {
            $scope.init = function() {
                //import from parent scope
                $scope.imagePlaceholders = $scope.$parent.imagePlaceholders;

                $scope.tableParams = new NgTableParams({
                    filter: { $: 'a' }
                }, {
                    dataset: $scope.videos,
                    filterOptions: {
                        filterFn: function(videos) {
                            if (!$scope.videosCache) {
                                $scope.videosCache = VideosSrv.filter(videos, $scope.tableOptions.filter);
                                $scope.verifyPageRange();
                            }

                            return $scope.videosCache;
                        }
                    }
                });

                $scope.tableHidden = true;
                $scope.optionsHidden = true;

                //defer visibility for smoother UI
                $timeout(function() {
                    $scope.tableHidden = false;
                }, 100);

                //sync: tableOptions -> tableParams
                $scope.$watchCollection('tableOptions.order', function(newVal, oldVal) {
                    $scope.tableParams.sorting($scope.tableOptions.order.column, $scope.tableOptions.order.type);
                });

                $scope.$watch('tableOptions.display.count', function(newVal, oldVal) {
                    $scope.tableParams.count($scope.tableOptions.display.count);
                });

                $scope.$watch('tableOptions.display.page', function(newVal, oldVal) {
                    $scope.tableParams.page($scope.tableOptions.display.page);
                });

                //sync: tableParams -> tableOptions
                $scope.$watch('tableParams.sorting()', function(newVal, oldVal) {
                    var sorting = $scope.tableParams.sorting();
                    for (var column in sorting) {
                        $scope.tableOptions.order.column = column;
                        $scope.tableOptions.order.type = sorting[column];
                        break;
                    }
                });

                $scope.$watch('tableParams.count()', function(newVal, oldVal) {
                    $scope.tableOptions.display.count = $scope.tableParams.count();
                });

                $scope.$watch('tableParams.page()', function(newVal, oldVal) {
                    $scope.verifyPageRange();
                    $scope.tableOptions.display.page = $scope.tableParams.page();
                });

                //clear videos cache on change
                $scope.$watch('tableOptions.filter', function(newVal, oldVal) {
                    $scope.clearVideosCache();
                }, true);

                $scope.$on('video.changed', function(video) {
                    $scope.clearVideosCache();
                    VideosSrv.save();
                });
            };

            $scope.verifyPageRange = function() {
                if ($scope.videosCache) {
                    var total = $scope.videosCache.length;
                    var current = $scope.tableParams.page();
                    var count = $scope.tableParams.count();
                    var last = Math.ceil(total / count) || 1;
                    if (current > last) {
                        $scope.tableParams.page(last);
                    } else if (current < 1) {
                        $scope.tableParams.page(1);
                    }
                }
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
                $scope.tableParams.reload();
            };

            $scope.init();
        }
    };
});
