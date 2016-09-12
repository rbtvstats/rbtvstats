'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:HostsCtrl
 * @description
 * # HostsCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('HostsCtrl', function($scope, $rootScope, $location, StateSrv, DataSrv) {
    $scope.init = function() {
        //model (default)
        $scope.model = {};
        $scope.model.host = null;
        $scope.model.videos = [];
        $scope.model.dataLatest = 0;
        $scope.model.chartsConfig = [];
        $scope.model.charts = [];
        $scope.model.stats = {};

        $scope.model.chartsConfig.push(configViewsDistribution);
        $scope.model.chartsConfig.push(configMonthlyContent);

        //load model state
        $scope.model = StateSrv.load($location.path(), $scope.model);

        $scope.host = {
            selected: $scope.getHost() || $scope.model.host || 'Eddy'
        };

        $scope.$on('updateData', function(event, args) {
            $scope.update();
        });

        $scope.$watch('host.selected', function(newVal, oldVal) {
            var param = {};
            if ($scope.host.selected) {
                param[$scope.host.selected] = true;
            }
            $location.search(param);
            $scope.update();
        });

        $scope.$on("$routeUpdate", function(event, route) {
            var params = $location.search();
            for (var host in params) {
                $scope.host.selected = host;
                break;
            }
        });
    };

    $scope.getHost = function() {
        var params = $location.search();
        for (var host in params) {
            return host;
        }

        return null;
    };

    $scope.update = function() {
        if ($scope.host.selected != $scope.model.host) {
            if ($scope.hosts.indexOf($scope.host.selected) > -1) {
                setTimeout(function() {
                    $scope.model.dataLatest = $scope.videoMetadata.time;
                    $scope.model.host = $scope.host.selected;

                    $scope.updateCharts();
                    $scope.updateStats();

                    $scope.assignArray($scope.model.videos, $scope.filterHost($scope.videos, $scope.model.host));

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

        var data = $scope.filterHost($scope.videos, $scope.model.host);
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

        stats.push({
            title: 'Ø Videos pro Tag',
            value: {
                type: 'number',
                text: Math.round((totalVideos / totalDays) * 100) / 100
            }
        });

        //soloVideos
        var soloVideos = 0;
        for (var j = 0; j < data.length; j++) {
            var video = data[j];
            var hosts = video.hosts || [];
            if (hosts.length == 1) {
                if (hosts[0] == $scope.model.host) {
                    soloVideos++;
                }
            }
        }

        stats.push({
            title: 'Videos ohne Co-Moderatoren',
            value: {
                type: 'number',
                text: soloVideos
            }
        });

        //topCohosts
        var allCohosts = {};
        for (var j = 0; j < data.length; j++) {
            var video = data[j];
            var hosts = video.hosts || [];
            for (var k = 0; k < hosts.length; k++) {
                var host = hosts[k];
                if (host != $scope.model.host) {
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

        var values = [];
        for (var j = 0; j < topCohosts.length; j++) {
            var topCohost = topCohosts[j];
            if (topCohost != null) {
                values.push({
                    type: 'url',
                    text: topCohost.name,
                    url: '#/hosts?' + window.encodeURIComponent(topCohost.name),
                    info: topCohost.count + ' Videos'
                });
            }
        }

        stats.push({
            title: 'Top ' + topCohosts.length + ' Co-Moderatoren',
            value: values
        });

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

        var values = [];
        for (var j = 0; j < topShows.length; j++) {
            var topShow = topShows[j];
            if (topShow != null) {
                values.push({
                    type: 'url',
                    text: topShow.name,
                    url: '#/shows?' + window.encodeURIComponent(topShow.name),
                    info: topShow.count + ' Videos'
                });
            }
        }

        stats.push({
            title: 'Top ' + topShows.length + ' Formate',
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
        var data = $scope.filterHost($scope.videos, $scope.model.host);
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

        chart.series.push($scope.model.host);

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

    var configMonthlyContent = function() {
        var data = $scope.groupMonthly($scope.filterHost($scope.videos, $scope.model.host));
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

        chart.series.push($scope.model.host);

        $scope.model.charts.push(chart);
    };

    $scope.init();
});
