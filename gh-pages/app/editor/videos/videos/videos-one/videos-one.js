angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.videos.one', {
        url: '/:videoId',
        templateUrl: 'app/editor/videos/videos/videos-one/videos-one.html',
        controller: function($scope, $state, $stateParams, VideosExtractorSrv, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.video = VideosSrv.findById($stateParams.videoId);
                $scope.videos = VideosSrv.all();
                $scope.channels = ChannelsSrv.all();
                $scope.shows = ShowsSrv.all();
                $scope.hosts = HostsSrv.all();
                $scope.series = SeriesSrv.all();

                $scope.$watch('video', function(newVal, oldVal) {
                    $scope.valid = VideosSrv.isValid($scope.video);

                    VideosSrv.save();
                }, true);
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

            $scope.delete = function(video) {
                VideosSrv.delete({ id: video.id });
                VideosSrv.save();
                $state.transitionTo('editor.videos.videos.all');
            };

            $scope.addShow = function(video, shows) {
                VideosSrv.addShow(video, shows);
            };

            $scope.removeShow = function(video, shows) {
                VideosSrv.removeShow(video, shows);
            };

            $scope.addHost = function(video, hosts) {
                VideosSrv.addHost(video, hosts);
            };

            $scope.removeHost = function(video, hosts) {
                VideosSrv.removeHost(video, hosts);
            };

            $scope.addSeries = function(video, series) {
                VideosSrv.addSeries(video, series);
            };

            $scope.removeSeries = function(video, series) {
                VideosSrv.removeSeries(video, series);
            };

            $scope.updateDetails = function(video) {
                VideosExtractorSrv.updateVideoDetails(video);
            };
        }
    });
});
