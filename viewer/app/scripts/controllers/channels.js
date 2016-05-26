'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:ChannelsCtrl
 * @description
 * # ChannelsCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('ChannelsCtrl', function($scope, $rootScope, $location, StateSrv, DataSrv) {
    $scope.init = function() {
        $scope.model = {};
        $scope.model.dataLatest = 0;
        $scope.model.chartsConfig = [];
        $scope.model.charts = [];
        $scope.model.stats = {};

        $scope.model.chartsConfig.push(configMonthlyContent);
        $scope.model.chartsConfig.push(configMonthlyViews);
        $scope.model.chartsConfig.push(configViewsDistribution);
        $scope.model.chartsConfig.push(configMonthlyLikeRation);
        $scope.model.chartsConfig.push(configMonthlyContentPerson);
        $scope.model.chartsConfig.push(configTotalContentPerson);

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

        $scope.model.dataLatest = $scope.metadata.time;
    };

    $scope.updateCharts = function() {
        $scope.model.charts = [];

        if ($scope.videos.length > 0) {
            for (var i = 0; i < $scope.model.chartsConfig.length; i++) {
                $scope.model.chartsConfig[i]();
            }
        }
    };

    $scope.updateStats = function() {
        $scope.model.stats = {};

        if ($scope.videos.length > 0) {
            var data = $scope.groupChannel($scope.videos);
            for (var i = 0; i < data.length; i++) {
                var channel = data[i].key;
                var dataset = data[i].value;

                //totalVideos
                var stats = {};
                stats.totalVideos = dataset.length;

                //averageViews + averageLength
                var totalViews = 0;
                var totalLength = 0;
                for (var j = 0; j < dataset.length; j++) {
                    totalViews += dataset[j].stats.viewCount;
                    totalLength += dataset[j].length;
                }
                stats.averageViews = Math.round(totalViews / stats.totalVideos);
                stats.averageLength = Math.round(totalLength / stats.totalVideos);

                //averageVideos
                var min = Number.MAX_VALUE;
                var max = 0;
                for (var j = 0; j < dataset.length; j++) {
                    var video = dataset[j];
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

                //topVideos
                var topVideos = [null, null, null, null, null];
                for (var j = 0; j < dataset.length; j++) {
                    var video = dataset[j];
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
                for (var j = 0; j < dataset.length; j++) {
                    var video = dataset[j];
                    if (mostLikes == null || video.stats.likeCount > mostLikes.stats.likeCount) {
                        mostLikes = video;
                    }
                    if (mostDislikes == null || video.stats.dislikeCount > mostDislikes.stats.dislikeCount) {
                        mostDislikes = video;
                    }
                }
                stats.mostLikes = mostLikes;
                stats.mostDislikes = mostDislikes;

                $scope.model.stats[channel] = stats;
            }
        }
    };

    var configMonthlyContent = function() {
        var data = $scope.groupMonthly($scope.videos);
        var chart = {};
        chart.labels = [];
        chart.series = [];
        chart.data = [];
        chart.options = {
            type: 'bar',
            header: 'Monatliche Inhalte in Stunden pro Kanal',
            width: '100%',
            height: '400px',
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        };

        data.sort($scope.orderKey);

        var channelData = {};
        for (var i = 0; i < data.length; i++) {
            var dataset = data[i];
            var dateParts = dataset.key.split(".");
            var date = new Date(dateParts[0], (dateParts[1] - 1), 1);

            var totalTime = {};
            for (var j = 0; j < dataset.value.length; j++) {
                var channel = dataset.value[j].channel;
                totalTime[channel] = totalTime[channel] || 0;
                totalTime[channel] += dataset.value[j].length;
            }

            for (var channel in totalTime) {
                totalTime[channel] = Math.round((totalTime[channel] / 3600) * 100) / 100;
                channelData[channel] = channelData[channel] || [];
                channelData[channel].push(totalTime[channel]);
            }

            chart.labels.push($scope.monthShortNames[date.getMonth()] + " " + date.getFullYear());
        }

        for (var channel in channelData) {
            chart.series.push(channel);
            chart.data.push(channelData[channel]);
        }

        $scope.model.charts.push(chart);
    };

    var configMonthlyViews = function() {
        var data = $scope.groupMonthly($scope.videos);
        var chart = {};
        chart.labels = [];
        chart.series = [];
        chart.data = [];
        chart.options = {
            type: 'bar',
            header: 'Monatliche Views pro Kanal',
            width: '100%',
            height: '400px',
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        };

        data.sort($scope.orderKey);

        var channelData = {};
        for (var i = 0; i < data.length; i++) {
            var dataset = data[i];
            var dateParts = dataset.key.split(".");
            var date = new Date(dateParts[0], (dateParts[1] - 1), 1);

            var totalViews = {};
            for (var j = 0; j < dataset.value.length; j++) {
                var channel = dataset.value[j].channel;
                totalViews[channel] = totalViews[channel] || 0;
                totalViews[channel] += Number(dataset.value[j].stats.viewCount);
            }

            for (var channel in totalViews) {
                channelData[channel] = channelData[channel] || [];
                channelData[channel].push(totalViews[channel]);
            }

            chart.labels.push($scope.monthShortNames[date.getMonth()] + " " + date.getFullYear());
        }

        for (var channel in channelData) {
            chart.series.push(channel);
            chart.data.push(channelData[channel]);
        }

        $scope.model.charts.push(chart);
    };

    var configViewsDistribution = function() {
        var data = $scope.groupChannel($scope.videos);
        var chart = {};
        chart.labels = [];
        chart.series = [];
        chart.data = [];
        chart.options = {
            type: 'bar',
            header: 'Häufigkeitsverteilung der Views pro Kanal',
            width: '100%',
            height: '400px',
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        var bucketSize = 1000;
        var channelData = {};
        for (var i = 0; i < data.length; i++) {
            var channel = data[i].key;
            var dataset = data[i].value;

            for (var j = 0; j < dataset.length; j++) {
                var video = dataset[j];
                var bucket = Math.floor(video.stats.viewCount / bucketSize) * bucketSize;
                channelData[channel] = channelData[channel] || {};
                channelData[channel][bucket] = channelData[channel][bucket] || 0;
                channelData[channel][bucket]++;
            }

            chart.series.push(channel);
        }

        var bucketCount = 0;
        var averageBucketSize = 0;
        var maxBucket = -1;
        for (var channel in channelData) {
            for (var bucket in channelData[channel]) {
                averageBucketSize += channelData[channel][bucket];
                bucketCount++;
                if (Number(bucket) > Number(maxBucket)) {
                    maxBucket = Number(bucket);
                }
            }
        }

        averageBucketSize = averageBucketSize / bucketCount;

        var data = {};
        var stop = false;
        var channelStop = {};
        var thresholdMax = 5;
        var threshold = 0.05;
        for (var i = 0; i < maxBucket && !stop; i += bucketSize) {
            chart.labels.push((i / 1000) + "k");

            for (var channel in channelData) {
                if (typeof channelStop[channel] !== 'number') {
                    channelStop[channel] = thresholdMax;
                }

                var value = channelData[channel][i] || 0;
                data[channel] = data[channel] || [];
                data[channel].push(value);

                if (value < (threshold * averageBucketSize)) {
                    channelStop[channel]--;
                }
            }

            stop = true;
            for (var channel in channelStop) {
                stop = stop && (channelStop[channel] <= 0);
            }
        }

        for (var channel in data) {
            chart.data.push(data[channel]);
        }

        $scope.model.charts.push(chart);
    };

    var configMonthlyLikeRation = function() {
        var data = $scope.groupMonthly($scope.videos);
        var chart = {};
        chart.labels = [];
        chart.series = [];
        chart.data = [];
        chart.options = {
            type: 'bar',
            header: 'Monatliche positive Bewertungen in Prozent pro Kanal',
            width: '100%',
            height: '500px',
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    //stacked: true
                }],
                yAxes: [{
                    //stacked: true,
                    //display: false
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        data.sort($scope.orderKey);

        var channelData = {};
        for (var i = 0; i < data.length; i++) {
            var dataset = data[i];
            var dateParts = dataset.key.split(".");
            var date = new Date(dateParts[0], (dateParts[1] - 1), 1);

            var totalLikesDislikes = {};
            for (var j = 0; j < dataset.value.length; j++) {
                var channel = dataset.value[j].channel;
                totalLikesDislikes[channel] = totalLikesDislikes[channel] || {};
                totalLikesDislikes[channel]['likes'] = totalLikesDislikes[channel]['likes'] || 0;
                totalLikesDislikes[channel]['dislikes'] = totalLikesDislikes[channel]['dislikes'] || 0;
                totalLikesDislikes[channel]['likes'] += Number(dataset.value[j].stats.likeCount);
                totalLikesDislikes[channel]['dislikes'] += Number(dataset.value[j].stats.dislikeCount);
            }

            for (var channel in totalLikesDislikes) {
                var total = totalLikesDislikes[channel]['likes'] + totalLikesDislikes[channel]['dislikes'];
                var ratio = 100 * totalLikesDislikes[channel]['likes'] / total;
                ratio = Math.round(ratio * 100) / 100;
                channelData[channel] = channelData[channel] || [];
                channelData[channel].push(ratio);
            }

            chart.labels.push($scope.monthShortNames[date.getMonth()] + " " + date.getFullYear());
        }

        for (var channel in channelData) {
            chart.series.push(channel);
            chart.data.push(channelData[channel]);
        }

        $scope.model.charts.push(chart);
    };

    var configMonthlyContentPerson = function() {
        var data = $scope.groupMonthly($scope.videos);
        var chart = {};
        chart.labels = [];
        chart.series = [];
        chart.data = [];
        chart.options = {
            type: 'bar',
            header: 'Monatliche Inhalte in Stunden pro Person',
            width: '100%',
            height: '500px',
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true,
                    display: false
                }]
            }
        };

        data.sort($scope.orderKey);

        var hostData = {};
        for (var i = 0; i < data.length; i++) {
            var dataset = data[i];
            var dateParts = dataset.key.split(".");
            var date = new Date(dateParts[0], (dateParts[1] - 1), 1);

            var totalTime = {};

            for (var j = 0; j < $scope.hosts.length; j++) {
                totalTime[$scope.hosts[j]] = 0;
            }

            for (var j = 0; j < dataset.value.length; j++) {
                var hosts = dataset.value[j].hosts || [];
                for (var k = 0; k < hosts.length; k++) {
                    var host = hosts[k];
                    totalTime[host] += dataset.value[j].length;
                }
            }

            for (var host in totalTime) {
                totalTime[host] = Math.round((totalTime[host] / 3600) * 100) / 100;
                hostData[host] = hostData[host] || [];
                hostData[host].push(totalTime[host]);
            }

            chart.labels.push($scope.monthShortNames[date.getMonth()] + " " + date.getFullYear());
        }

        for (var host in hostData) {
            chart.series.push(host);
            chart.data.push(hostData[host]);
        }

        $scope.model.charts.push(chart);
    };

    var configTotalContentPerson = function() {
        var data = $scope.groupHosts($scope.videos);
        var chart = {};
        chart.labels = [];
        chart.data = [];
        chart.options = {
            type: 'doughnut',
            header: 'Gesamte Inhalte in Stunden pro Person',
            width: '100%',
            height: '400px',
            legend: {
                display: false
            }
        };

        var channelData = [];
        for (var i = 0; i < data.length; i++) {
            var dataset = data[i];
            var totalTime = 0;
            for (var j = 0; j < dataset.value.length; j++) {
                var video = dataset.value[j];
                totalTime += video.length;
            }

            totalTime = Math.round((totalTime / 3600) * 100) / 100;

            channelData.push({ key: dataset.key, value: totalTime });
        }

        channelData.sort($scope.orderValue);

        for (var i = 0; i < channelData.length; i++) {
            chart.labels.push(channelData[i].key);
            chart.data.push(channelData[i].value);
        }

        $scope.model.charts.push(chart);
    };

    $scope.init();
});
