'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:ShowsCtrl
 * @description
 * # ShowsCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('ShowsCtrl', function($scope, $rootScope, $location, $timeout, StateSrv, DataSrv) {
    $scope.initFinished = false;

    $scope.init = function() {
        $scope.default = {};
        $scope.default.show = 'Bohn Jour';

        //model (default)
        $scope.model = {};
        $scope.model.show = null;
        $scope.model.series = null;
        $scope.model.seriesList = [];
        $scope.model.videos = [];
        $scope.model.chartsConfig = [];
        $scope.model.charts = [];
        $scope.model.stats = {};

        $scope.model.chartsConfig.push(configViewsDistribution);
        $scope.model.chartsConfig.push(configMonthlyAverageViews);

        //load model state
        $scope.model = StateSrv.load($location.path(), $scope.model);

        $scope.show = {
            selected: $scope.getShow() || $scope.model.show || $scope.default.show
        };

        $scope.series = {
            selected: $scope.getSeries() || $scope.model.series
        };

        $scope.$on('updateVideoData', function(event, args) {
            $scope.update();
        });

        $scope.$watchGroup(['show.selected', 'series.selected'], function(newVal, oldVal) {
            var params = {};

            if ($scope.show.selected) {
                params.show = $scope.show.selected;
            }

            if ($scope.series.selected) {
                params.series = $scope.series.selected;
            }

            $location.search(params);
            $scope.update();
        });

        $scope.$on('$routeUpdate', function(event, route) {
            $scope.show.selected = $scope.getShow() || $scope.model.show || $scope.default.show;
            $scope.series.selected = $scope.getSeries();
        });

        $timeout(function() {
            $scope.initFinished = true;
        }, 100);
    };

    $scope.getShow = function() {
        var show = null;
        var params = $location.search();

        //legacy parameter
        for (var param in params) {
            if (typeof params[param] === 'boolean') {
                show = param;
            }
        }

        if (typeof params.show !== 'undefined') {
            show = params.show;
        }

        return show;
    };

    $scope.getSeries = function() {
        var series = null;
        var params = $location.search();

        if (typeof params.series !== 'undefined') {
            series = params.series;
        }

        return series;
    };

    $scope.update = function() {
        if (($scope.show.selected != $scope.model.show) || ($scope.series.selected != $scope.model.series)) {
            if ($scope.shows.indexOf($scope.show.selected) > -1) {
                $scope.model.show = $scope.show.selected;
                $scope.model.series = $scope.series.selected;

                $scope.updateSeries();

                $scope.assignArray($scope.model.videos, $scope.filterShow($scope.videos, $scope.model.show));

                if ($scope.model.seriesList.indexOf($scope.series.selected) > -1) {
                    $scope.assignArray($scope.model.videos, $scope.filterSeries($scope.model.videos, $scope.model.series));
                } else {
                    setTimeout(function() {
                        $scope.series.selected = null;
                    }, 0);
                }

                $scope.updateCharts();
                $scope.updateStats();
            }
        }
    };

    $scope.updateSeries = function() {
        var seriesList = [];

        var data = $scope.filterShow($scope.videos, $scope.model.show);
        for (var i = 0; i < data.length; i++) {
            var show = data[i];
            var series = show.series || [];
            for (var j = 0; j < series.length; j++) {
                var s = series[j];
                if (seriesList.indexOf(s) == -1) {
                    seriesList.push(s);
                }
            }
        }

        $scope.model.seriesList = seriesList;
    };

    $scope.updateCharts = function() {
        $scope.model.charts = [];
        for (var i = 0; i < $scope.model.chartsConfig.length; i++) {
            $scope.model.chartsConfig[i]();
        }
    };

    $scope.updateStats = function() {
        $scope.model.stats = {};

        var data = $scope.model.videos;
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
                    url: '#/hosts?host=' + topHost.name,
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
        var data = $scope.model.videos;
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

    var configMonthlyAverageViews = function() {
        var data = $scope.groupMonthly($scope.model.videos);
        var chart = {};
        chart.labels = [];
        chart.series = [];
        chart.data = [];
        chart.options = {
            type: 'bar',
            header: 'Monatliche durchschnittliche Video Views',
            width: '100%',
            height: '500px',
            legend: {
                display: false
            },
            scales: {
                xAxes: [{

                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Views'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        data.sort($scope.orderKey);

        chart.series.push($scope.model.show);

        var videoData = [];
        for (var i = 0; i < data.length; i++) {
            var dataset = data[i];
            var dateParts = dataset.key.split(".");
            var date = new Date(dateParts[0], (dateParts[1] - 1), 1);

            var totalVideos = 0;
            var totalViews = 0;
            for (var j = 0; j < dataset.value.length; j++) {
                var channel = dataset.value[j].channel;
                totalVideos = totalVideos || 0;
                totalVideos++;
                totalViews = totalViews || 0;
                totalViews += dataset.value[j].stats.viewCount;
            }

            var averageViews = Math.round(totalViews / totalVideos);
            videoData.push(averageViews);

            chart.labels.push($scope.monthShortNames[date.getMonth()] + " " + date.getFullYear());
        }

        chart.data.push(videoData);

        $scope.model.charts.push(chart);
    };

    $timeout($scope.init, 0);
});
