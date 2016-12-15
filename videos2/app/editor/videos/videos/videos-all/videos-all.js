angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.videos.all', {
        url: '/',
        templateUrl: 'app/editor/videos/videos/videos-all/videos-all.html',
        controller: function($scope, $filter, $q, Notification, StateSrv, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.videos = VideosSrv.all();
                $scope.channels = ChannelsSrv.all();
                $scope.shows = ShowsSrv.all();
                $scope.hosts = HostsSrv.all();
                $scope.series = SeriesSrv.all();

                $scope.updateState = {
                    active: false,
                    info: null,
                    latest: null
                };
                $scope.exec = {
                    code: 'console.log(video);'
                };

                $scope.updateUntil = moment(new Date(2015, 0, 15)).unix();

                StateSrv.watch($scope, ['exec']);
            };

            $scope.updateVideos = function(channels, untilCallback) {
                channels = channels.slice();
                $scope.updateState.active = true;

                function progress(video) {
                    $scope.updateState.latest = video;
                }

                function update(channels) {
                    var channel = channels.pop();
                    var until = untilCallback(channel);

                    $scope.updateState.info = 'Lade Videos für Kanal \'' + channel.title + '\'';

                    //update videos of channel
                    return VideosSrv.updateVideos(channel, until, progress)
                        .then(function() {
                            //continue?
                            if (channels.length > 0) {
                                return update(channels);
                            }
                        });
                }

                update(channels)
                    .then(function() {

                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Abrufen der Video Liste',
                            err: err,
                            errPath: 'data.error.message',
                            delay: null
                        }));
                    })
                    .finally(function() {
                        $scope.updateState.active = false;
                        $scope.updateState.info = null;
                        $scope.updateState.latest = null;

                        VideosSrv.save();
                        $scope.update();
                    });
            };

            $scope.updateVideoDetails = function(videos) {
                $scope.updateState.active = true;
                $scope.updateState.info = 'Lade Video Details';

                function progress(video) {
                    $scope.updateState.latest = video;
                }

                VideosSrv.updateVideoDetails(videos, progress)
                    .then(function() {

                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Abrufen der Video Details',
                            err: err,
                            errPath: 'data.error.message',
                            delay: null
                        }));
                    })
                    .finally(function() {
                        $scope.updateState.active = false;
                        $scope.updateState.info = null;
                        $scope.updateState.latest = null;

                        VideosSrv.save();
                        $scope.update();
                    });
            };

            $scope.updateVideosAll = function() {
                var date = new Date(1970, 0, 1);

                function until(channel) {
                    return date;
                }

                $scope.updateVideos($scope.channels, until);
            };

            $scope.updateVideosNew = function() {
                function until(channel) {
                    var videos = VideosSrv.find({ channel: channel.id });

                    var video = _.maxBy(videos, 'published');
                    if (video) {
                        return new Date(video.published * 1000);
                    }

                    return new Date(2015, 0, 15);
                }

                $scope.updateVideos($scope.channels, until);
            };

            $scope.updateVideosAllUntil = function(date) {
                date = new Date(date);

                function until(channel) {
                    return date;
                }

                $scope.updateVideos($scope.channels, until);
            };

            $scope.updateVideoDetailsAll = function() {
                var videos = $scope.videos;

                $scope.updateVideoDetails(videos);
            };

            $scope.updateVideoDetailsNew = function() {
                var videos = VideosSrv.find({ online: false });

                $scope.updateVideoDetails(videos);
            };

            $scope.updateVideoDetailsFiltered = function() {
                var videos = $scope.videosFiltered; //TODO

                $scope.updateVideoDetails(videos);
            };

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.videos, function(video) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };
        }
    });
});
