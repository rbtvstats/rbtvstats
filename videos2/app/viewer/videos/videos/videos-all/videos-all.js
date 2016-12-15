angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.videos.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/videos/videos-all/videos-all.html',
        controller: function($scope, VideosSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { online: true });
            };
        }
    });
});
