'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:ShowsCtrl
 * @description
 * # ShowsCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('ShowsCtrl', function($scope, $rootScope, $location, NgTableParams, StateSrv, DataSrv) {
    $scope.init = function() {
        $scope.model = {};
        $scope.model.filteredVideos = [];
        $scope.model.dataLatest = 0;
        $scope.model.chartsConfig = [];
        $scope.model.charts = [];
        $scope.model.stats = {};
        $scope.model.show = {
            selected: 'Bohn Jour'
        };
        $scope.model.videosTable = new NgTableParams({
            sorting: {
                published: 'desc'
            },
            count: 25
        }, {
            dataset: $scope.model.filteredVideos
        });

        $scope.model.chartsConfig.push(configViewsDistribution);

        $scope.model = StateSrv.load($location.path(), $scope.model);

        $scope.$on('updateData', function(event, args) {
            $scope.update();
        });

        if ($scope.model.dataLatest != $scope.metadata.time && $scope.metadata.time > 0) {
            $scope.update();
        }
    };

    $scope.update = function() {
        $scope.updateCharts();
        $scope.updateStats();

        //filter videos
        var filteredVideos = $scope.filterShow($scope.videos, $scope.model.show.selected);
        $scope.model.filteredVideos.length = 0;
        for (var i = 0; i < filteredVideos.length; i++) {
            $scope.model.filteredVideos.push(filteredVideos[i]);
        }

        $scope.model.videosTable.reload();

        $scope.model.dataLatest = $scope.metadata.time;
    };

    $scope.updateCharts = function() {
        $scope.model.charts = [];
        if ($scope.model.show.selected) {
            for (var i = 0; i < $scope.model.chartsConfig.length; i++) {
                $scope.model.chartsConfig[i]();
            }
        }
    };

    $scope.updateStats = function() {
        $scope.model.stats = {};

        if ($scope.model.show.selected) {
            var data = $scope.filterShow($scope.videos, $scope.model.show.selected);

            //totalVideos
            var stats = {};
            stats.totalVideos = data.length;

            //averageViews
            var totalViews = 0;
            for (var j = 0; j < data.length; j++) {
                totalViews += data[j].stats.viewCount;
            }
            stats.averageViews = Math.round(totalViews / stats.totalVideos);

            //topHosts
            var allHosts = {};
            for (var j = 0; j < data.length; j++) {
                var video = data[j];
                var hosts = video.hosts || [];
                for (var k = 0; k < hosts.length; k++) {
                    var host = hosts[k];
                    if (host != $scope.model.show.selected) {
                        allHosts[host] = allHosts[host] || {};
                        allHosts[host].count = allHosts[host].count || 0;
                        allHosts[host].count++;
                        //allHosts[host].videos = allHosts[host].videos || [];
                        //allHosts[host].videos.push(video);
                    }
                }
            }

            var topHosts = [null, null, null, null, null];
            for (var host in allHosts) {
                for (var k = 0; k < topHosts.length; k++) {
                    if (topHosts[k] == null || allHosts[host].count > topHosts[k].count) {
                        topHosts.splice(k, 0, {
                            name: host,
                            count: allHosts[host].count
                                //videos: allHosts[host].videos
                        });
                        topHosts.length = topHosts.length - 1;
                        k = topHosts.length;
                    }
                }
            }

            stats.topHosts = topHosts;

            //topVideos
            var topVideos = [null, null, null, null, null];
            for (var j = 0; j < data.length; j++) {
                var video = data[j];
                for (var k = 0; k < topVideos.length; k++) {
                    if (topVideos[k] == null || video.stats.viewCount > topVideos[k].stats.viewCount) {
                        topVideos.splice(k, 0, video);
                        topVideos.length = topVideos.length - 1;
                        k = topVideos.length;
                    }
                }
            }
            stats.topVideos = topVideos;

            //mostLikes + mostDislikes
            var mostLikes = null;
            var mostDislikes = null;
            for (var j = 0; j < data.length; j++) {
                var video = data[j];
                if (mostLikes == null || video.stats.likeCount > mostLikes.stats.likeCount) {
                    mostLikes = video;
                }
                if (mostDislikes == null || video.stats.dislikeCount > mostDislikes.stats.dislikeCount) {
                    mostDislikes = video;
                }
            }
            stats.mostLikes = mostLikes;
            stats.mostDislikes = mostDislikes;

            $scope.model.stats = stats;
        }
    };

    var configViewsDistribution = function() {
        var data = $scope.filterShow($scope.videos, $scope.model.show.selected);
        var chart = {};
        chart.labels = [];
        chart.series = [];
        chart.data = [
            []
        ];
        chart.options = {
            type: 'bar',
            header: 'Häufigkeitsverteilung der Views',
            width: '100%',
            height: '400px',
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Views'
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Anzahl Videos'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        var bucketSize = 2000;
        var totalViews = 0;
        var viewsData = {};
        for (var j = 0; j < data.length; j++) {
            var video = data[j];
            var bucket = Math.floor(video.stats.viewCount / bucketSize) * bucketSize;
            totalViews += video.stats.viewCount;
            viewsData[bucket] = viewsData[bucket] || 0;
            viewsData[bucket]++;
        }

        chart.series.push($scope.model.show.selected);

        var bucketCount = 0;
        var videosCount = 0;
        var maxBucket = -1;
        for (var bucket in viewsData) {
            videosCount += viewsData[bucket];
            bucketCount++;
            if (Number(bucket) > Number(maxBucket)) {
                maxBucket = Number(bucket);
            }
        }

        var averageBucketSize = videosCount / bucketCount;
        var averageViews = Math.floor((totalViews / data.length) / bucketSize) * bucketSize;

        //right (> averageViews)
        var abortThreshold = 5;
        var abort = abortThreshold;
        var threshold = 0.1;
        for (var i = averageViews; abort > 0; i += bucketSize) {
            var value = viewsData[i] || 0;

            chart.labels.push((i / 1000) + "k");
            chart.data[0].push(value);

            if (value < (threshold * averageBucketSize)) {
                abort--;
            }
        }

        //left (< averageViews)
        abort = abortThreshold
        for (var i = averageViews - bucketSize; i >= 0 && abort > 0; i -= bucketSize) {
            var value = viewsData[i] || 0;

            chart.labels.unshift((i / 1000) + "k");
            chart.data[0].unshift(value);

            if (value < (threshold * averageBucketSize)) {
                abort--;
            }
        }

        $scope.model.charts.push(chart);
    };

    $scope.init();
});
