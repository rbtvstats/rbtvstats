'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:HostsCtrl
 * @description
 * # HostsCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('HostsCtrl', function($scope, $rootScope, $location, NgTableParams, StateSrv, DataSrv) {
    $scope.init = function() {
        $scope.model = {};
        $scope.model.filteredVideos = [];
        $scope.model.dataLatest = 0;
        $scope.model.chartsConfig = [];
        $scope.model.charts = [];
        $scope.model.stats = {};
        $scope.model.host = {
            selected: 'Eddy'
        };
        $scope.model.videosTable = new NgTableParams({
            sorting: {
                published: 'desc'
            },
            count: 25
        }, {
            dataset: $scope.model.filteredVideos
        });

        $scope.model.chartsConfig.push(configMonthlyContent);
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
        var filteredVideos = $scope.filterHost($scope.videos, $scope.model.host.selected);
        $scope.model.filteredVideos.length = 0;
        for (var i = 0; i < filteredVideos.length; i++) {
            $scope.model.filteredVideos.push(filteredVideos[i]);
        }

        $scope.model.videosTable.reload();

        $scope.model.dataLatest = $scope.metadata.time;
    };

    $scope.updateCharts = function() {
        $scope.model.charts = [];
        if ($scope.model.host.selected) {
            for (var i = 0; i < $scope.model.chartsConfig.length; i++) {
                $scope.model.chartsConfig[i]();
            }
        }
    };

    $scope.updateStats = function() {
        $scope.model.stats = {};

        if ($scope.model.host.selected) {
            var data = $scope.filterHost($scope.videos, $scope.model.host.selected);

            //totalVideos
            var stats = {};
            stats.totalVideos = data.length;

            //averageViews
            var totalViews = 0;
            for (var j = 0; j < data.length; j++) {
                totalViews += data[j].stats.viewCount;
            }
            stats.averageViews = Math.round(totalViews / stats.totalVideos);

            //averageVideos
            var min = Number.MAX_VALUE;
            var max = 0;
            for (var j = 0; j < data.length; j++) {
                var video = data[j];
                if (video.published < min) {
                    min = video.published;
                }
                if (video.published > max) {
                    max = video.published;
                }
            }
            min = new Date(min * 1000);
            max = new Date(max * 1000);
            var totalDays = max - min;
            totalDays = totalDays / (1000 * 60 * 60 * 24);

            stats.averageVideos = Math.round((stats.totalVideos / totalDays) * 100) / 100;

            //soloVideos
            var soloVideos = 0;
            for (var j = 0; j < data.length; j++) {
                var video = data[j];
                var hosts = video.hosts || [];
                if (hosts.length == 1) {
                    if (hosts[0] == $scope.model.host.selected) {
                        soloVideos++;
                    }
                }
            }

            stats.soloVideos = soloVideos;

            //topCohosts
            var allCohosts = {};
            for (var j = 0; j < data.length; j++) {
                var video = data[j];
                var hosts = video.hosts || [];
                for (var k = 0; k < hosts.length; k++) {
                    var host = hosts[k];
                    if (host != $scope.model.host.selected) {
                        allCohosts[host] = allCohosts[host] || {};
                        allCohosts[host].count = allCohosts[host].count || 0;
                        allCohosts[host].count++;
                        //allCohosts[host].videos = allCohosts[host].videos || [];
                        //allCohosts[host].videos.push(video);
                    }
                }
            }

            var topCohosts = [null, null, null, null, null];
            for (var host in allCohosts) {
                for (var k = 0; k < topCohosts.length; k++) {
                    if (topCohosts[k] == null || allCohosts[host].count > topCohosts[k].count) {
                        topCohosts.splice(k, 0, {
                            name: host,
                            count: allCohosts[host].count
                                //videos: allCohosts[host].videos
                        });
                        topCohosts.length = topCohosts.length - 1;
                        k = topCohosts.length;
                    }
                }
            }

            stats.topCohosts = topCohosts;

            //topShows
            var allShows = {};
            for (var j = 0; j < data.length; j++) {
                var video = data[j];
                var shows = video.shows || [];
                for (var k = 0; k < shows.length; k++) {
                    var show = shows[k];
                    allShows[show] = allShows[show] || {};
                    allShows[show].count = allShows[show].count || 0;
                    allShows[show].count++;
                    //allShows[show].videos = allShows[show].videos || [];
                    //allShows[show].videos.push(video);
                }
            }

            var topShows = [null, null, null, null, null];
            for (var show in allShows) {
                for (var k = 0; k < topShows.length; k++) {
                    if (topShows[k] == null || allShows[show].count > topShows[k].count) {
                        topShows.splice(k, 0, {
                            name: show,
                            count: allShows[show].count
                                //videos: allShows[show].videos
                        });
                        topShows.length = topShows.length - 1;
                        k = topShows.length;
                    }
                }
            }

            stats.topShows = topShows;

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

    var configMonthlyContent = function() {
        var data = $scope.groupMonthly($scope.filterHost($scope.videos, $scope.model.host.selected));
        var chart = {};
        chart.labels = [];
        chart.series = [];
        chart.data = [
            []
        ];
        chart.options = {
            type: 'bar',
            header: 'Monatliche Inhalte in Stunden',
            width: '100%',
            height: '400px',
            legend: {
                display: false
            },
            scales: {
                xAxes: [{

                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Stunden'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        data.sort($scope.orderKey);

        for (var i = 0; i < data.length; i++) {
            var dataset = data[i];
            var dateParts = dataset.key.split(".");
            var date = new Date(dateParts[0], (dateParts[1] - 1), 1);

            var totalTime = 0;
            for (var j = 0; j < dataset.value.length; j++) {
                totalTime = totalTime || 0;
                totalTime += dataset.value[j].length;
            }

            totalTime = Math.round((totalTime / 3600) * 100) / 100;

            chart.labels.push($scope.monthShortNames[date.getMonth()] + " " + date.getFullYear());
            chart.data[0].push(totalTime);
        }

        chart.series.push($scope.model.host.selected);

        $scope.model.charts.push(chart);
    };

    var configViewsDistribution = function() {
        var data = $scope.filterHost($scope.videos, $scope.model.host.selected);
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
                    }
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

        chart.series.push($scope.model.host.selected);

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
