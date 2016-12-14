angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.videos.one', {
        url: '/:videoId',
        templateUrl: 'app/editor/videos/videos/videos-one/videos-one.html',
        controller: function($scope, $state, $stateParams, InitSrv, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
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

            $scope.delete = function(video) {
                VideosSrv.delete({ id: video.id });
                VideosSrv.save();
                $state.transitionTo('editor.videos.videos.all');
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
