'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:ShowsCtrl
 * @description
 * # ShowsCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('ShowsCtrl', function($scope, $rootScope, $location, StateSrv, DataSrv) {
    $scope.init = function() {
        //model (default)
        $scope.model = {};
        $scope.model.show = null;
        $scope.model.videos = [];
        $scope.model.dataLatest = 0;
        $scope.model.chartsConfig = [];
        $scope.model.charts = [];
        $scope.model.stats = {};

        $scope.model.chartsConfig.push(configViewsDistribution);

        //load model state
        $scope.model = StateSrv.load($location.path(), $scope.model);

        $scope.show = {
            selected: $scope.getShow() || $scope.model.show || 'Bohn Jour'
        };

        $scope.$on('updateData', function(event, args) {
            $scope.update();
        });

        $scope.$watch('show.selected', function(newVal, oldVal) {
            var param = {};
            if ($scope.show.selected) {
                param[$scope.show.selected] = true;
            }
            $location.search(param);
            $scope.update();
        });

        $scope.$on("$routeUpdate", function(event, route) {
            var params = $location.search();
            for (var show in params) {
                $scope.show.selected = show;
                break;
            }
        });
    };

    $scope.getShow = function() {
        var params = $location.search();
        for (var show in params) {
            return show;
        }

        return null;
    };

    $scope.update = function() {
        if ($scope.show.selected != $scope.model.show || ($scope.model.dataLatest != $scope.metadata.time && $scope.metadata.time > 0)) {
            if ($scope.shows.indexOf($scope.show.selected) > -1) {
                setTimeout(function() {
                    $scope.model.dataLatest = $scope.metadata.time;
                    $scope.model.show = $scope.show.selected;

                    $scope.updateCharts();
                    $scope.updateStats();

                    $scope.assignArray($scope.model.videos, $scope.filterShow($scope.videos, $scope.model.show));

                    $scope.$apply();
                }, 0);
            }
        }
    };

    $scope.updateCharts = function() {
        $scope.model.charts = [];
        for (var i = 0; i < $scope.model.chartsConfig.length; i++) {
            $scope.model.chartsConfig[i]();
        }
    };

    $scope.updateStats = function() {
        $scope.model.stats = {};

        var data = $scope.filterShow($scope.videos, $scope.model.show);
        var stats = [];

        //totalVideos
        var totalVideos = data.length;
        stats.push({
            title: 'Anzahl Videos',
            value: {
                type: 'number',
                text: totalVideos
            }
        });

        //averageViews
        var totalViews = 0;
        for (var j = 0; j < data.length; j++) {
            totalViews += data[j].stats.viewCount;
        }
        stats.push({
            title: 'Ø Views pro Video',
            value: {
                type: 'number',
                text: Math.round(totalViews / totalVideos)
            }
        });

        //topHosts
        var allHosts = {};
        for (var j = 0; j < data.length; j++) {
            var video = data[j];
            var hosts = video.hosts || [];
            for (var k = 0; k < hosts.length; k++) {
                var host = hosts[k];
                allHosts[host] = allHosts[host] || {};
                allHosts[host].count = allHosts[host].count || 0;
                allHosts[host].count++;
                //allHosts[host].videos = allHosts[host].videos || [];
                //allHosts[host].videos.push(video);
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

        var values = [];
        for (var j = 0; j < topHosts.length; j++) {
            var topHost = topHosts[j];
            if (topHost != null) {
                values.push({
                    type: 'url',
                    text: topHost.name,
                    url: '#/hosts?' + topHost.name,
                    info: topHost.count + ' Videos'
                });
            }
        }

        stats.push({
            title: 'Top ' + topHosts.length + ' Moderatoren',
            value: values
        });

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

        var values = [];
        for (var j = 0; j < topVideos.length; j++) {
            var video = topVideos[j];
            if (video != null) {
                values.push({
                    type: 'url',
                    text: video.title,
                    url: 'https://www.youtube.com/watch?v=' + video.id,
                    info: video.stats.viewCount + ' Views'
                });
            }
        }

        stats.push({
            title: 'Top ' + topVideos.length + ' meiste Views',
            value: values
        });

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

        stats.push(stats.mostLikes = {
            title: 'Meiste positive Bewertungen',
            value: {
                type: 'url',
                text: mostLikes.title,
                url: 'https://www.youtube.com/watch?v=' + mostLikes.id,
                info: mostLikes.stats.likeCount + ' Bewertungen'
            }
        });
        stats.push({
            title: 'Meiste negative Bewertungen',
            value: {
                type: 'url',
                text: mostDislikes.title,
                url: 'https://www.youtube.com/watch?v=' + mostDislikes.id,
                info: mostDislikes.stats.dislikeCount + ' Bewertungen'
            }
        });

        $scope.model.stats = stats;
    };

    var configViewsDistribution = function() {
        var data = $scope.filterShow($scope.videos, $scope.model.show);
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

        chart.series.push($scope.model.show);

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
        var abortThreshold = 10;
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
