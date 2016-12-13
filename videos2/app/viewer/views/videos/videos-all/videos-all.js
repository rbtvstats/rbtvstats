angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.all', {
        url: '/',
        templateUrl: 'app/viewer/views/videos/videos-all/videos-all.html',
        controller: function($scope, InitSrv, VideosSrv) {
            $scope.init = function() {
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { online: true });
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
