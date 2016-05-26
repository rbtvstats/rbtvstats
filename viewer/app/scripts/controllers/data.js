'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('DataCtrl', function($scope, $rootScope, $location, NgTableParams, StateSrv, DataSrv) {
    $scope.init = function() {
        $rootScope.state = {};
        $scope.loadingData = true;
        $scope.metadata = {};
        $scope.videos = [];
        $scope.channels = [];
        $scope.shows = [];
        $scope.hosts = [];
        $scope.monthShortNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

        $scope.$on("$routeChangeStart", function(event, next, current) {
            if (typeof current !== 'undefined') {
                if (typeof current.scope !== 'undefined') {
                    StateSrv.save(current.originalPath, current.scope.model);
                }
            }
        });

        $scope.update();
    };

    $scope.findByKey = function(output, key) {
        for (var i = 0; i < output.length; i++) {
            if (output[i].key == key) {
                return output[i];
            }
        }

        var dataset = { key: key, value: [] };
        output.push(dataset);
        return dataset;
    };

    $scope.filterChannel = function(videos, channel) {
        var output = [];

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];

            if (video.channel == channel) {
                output.push(video);
            }
        }

        return output;
    };

    $scope.filterHost = function(videos, host) {
        var output = [];

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];

            if (video.hosts) {
                if (video.hosts.indexOf(host) > -1) {
                    output.push(video);
                }
            }
        }

        return output;
    };

    $scope.filterShow = function(videos, show) {
        var output = [];

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];

            if (video.shows) {
                if (video.shows.indexOf(show) > -1) {
                    output.push(video);
                }
            }
        }

        return output;
    };

    $scope.filterTime = function(videos, min, max) {
        var output = [];

        min = min || new Date();
        max = max || new Date();

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var date = new Date(video.published * 1000);

            if (date > min && date < max) {
                output.push(video);
            }
        }

        return output;
    };

    $scope.groupChannel = function(videos) {
        var output = [];

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var dataset = $scope.findByKey(output, video.channel);
            dataset.value.push(video);
        }

        return output;
    };

    $scope.groupMonthly = function(videos) {
        var output = [];

        var min = Number.MAX_VALUE;
        var max = 0;
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            if (video.published < min) {
                min = video.published;
            }
            if (video.published > max) {
                max = video.published;
            }
        }

        min = new Date(min * 1000);
        max = new Date(max * 1000);
        while (min < max) {
            var key = min.getFullYear() + '.' + ((min.getMonth() + 1 < 10) ? '0' : '') + (min.getMonth() + 1);
            $scope.findByKey(output, key);
            min.setMonth(min.getMonth() + 1);
        }

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var date = new Date(video.published * 1000);
            var key = date.getFullYear() + '.' + ((date.getMonth() + 1 < 10) ? '0' : '') + (date.getMonth() + 1);
            var dataset = $scope.findByKey(output, key);
            dataset.value.push(video);
        }

        return output;
    };

    $scope.groupHosts = function(videos) {
        var output = [];

        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var hosts = video.hosts || [];
            for (var j = 0; j < hosts.length; j++) {
                var host = hosts[j];
                var dataset = $scope.findByKey(output, host);
                dataset.value.push(video);
            }
        }

        return output;
    };

    $scope.orderKey = function(a, b) {
        if (a.key < b.key)
            return -1;
        else if (a.key > b.key)
            return 1;
        else
            return 0;
    };

    $scope.orderValue = function(a, b) {
        if (a.value < b.value)
            return -1;
        else if (a.value > b.value)
            return 1;
        else
            return 0;
    };

    $scope.getAllShows = function(videos) {
        var allShows = [];

        for (var i = 0; i < videos.length; i++) {
            var shows = videos[i].shows || [];
            for (var k = 0; k < shows.length; k++) {
                var show = shows[k];
                if (allShows.indexOf(show) < 0) {
                    allShows.push(show);
                }
            }
        }

        return allShows;
    };

    $scope.getAllHosts = function(videos) {
        var allHosts = [];

        for (var i = 0; i < videos.length; i++) {
            var hosts = videos[i].hosts || [];
            for (var k = 0; k < hosts.length; k++) {
                var host = hosts[k];
                if (allHosts.indexOf(host) < 0) {
                    allHosts.push(host);
                }
            }
        }

        return allHosts;
    };

    $scope.getAllChannels = function(videos) {
        var allChannels = [];

        for (var i = 0; i < videos.length; i++) {
            var channel = videos[i].channel;
            if (allChannels.indexOf(channel) < 0) {
                allChannels.push(channel);
            }
        }

        return allChannels;
    };

    $scope.toList = function(array) {
        if ($.isArray(array)) {
            return array.join(", ");
        } else {
            return '';
        }
    };

    $scope.update = function() {
        $scope.loadingData = true;

        DataSrv.getData().then(function(data) {
            var tmpVideos = [];
            for (var key in data) {
                tmpVideos.push(data[key]);
            }

            //filter videos
            var filteredVideos = $scope.filterTime(tmpVideos, new Date(2015, 2, 3));
            $scope.videos.length = 0;
            for (var i = 0; i < filteredVideos.length; i++) {
                $scope.videos.push(filteredVideos[i]);
            }

            $scope.shows = $scope.getAllShows($scope.videos);
            $scope.hosts = $scope.getAllHosts($scope.videos);
            $scope.channels = $scope.getAllChannels($scope.videos);

            DataSrv.getMetadata().then(function(data) {
                $scope.metadata = data;

                $scope.$broadcast('updateData');
                $scope.loadingData = false;
            });
        });
    };

    $scope.init();
});
