angular.module('app.common').directive('videosEdit', function() {
    return {
        restrict: 'A',
        templateUrl: 'app/common/videos-view/videos-edit/videos-edit.html',
        controller: function($scope, VideosSrv) {
            $scope.$watch('video', function(newVal, oldVal) {
                $scope.valid = VideosSrv.isValid($scope.video);

                VideosSrv.save();
                $scope.videoChanged($scope.video);
            }, true);
        }
    };
});