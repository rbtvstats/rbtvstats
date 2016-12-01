angular.module('app.editor').controller('VideosOneCtrl', function($scope, $state, $stateParams, VideosSrv, ChannelsSrv, ShowsSrv, HostsSrv, SeriesSrv) {
    $scope.init = function() {
        $scope.video = VideosSrv.findById($stateParams.videoId);
        $scope.videos = VideosSrv.all();
        $scope.channels = ChannelsSrv.all();
        $scope.shows = ShowsSrv.all();
        $scope.hosts = HostsSrv.all();
        $scope.series = SeriesSrv.all();

        $scope.$watch('video', function(newVal, oldVal) {
            $scope.valid = VideosSrv.isValid($scope.video);

            VideosSrv.saveDelayed();
            $scope.videoChanged($scope.video);
        }, true);
    };

    $scope.delete = function(video) {
        VideosSrv.delete({ id: video.id });
        VideosSrv.saveDelayed();
        $state.transitionTo('editor.videos.all');
    };

    $scope.init();
});
