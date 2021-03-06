angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.hosts.one', {
        url: '/:hostId',
        templateUrl: 'app/editor/videos/hosts/hosts-one/hosts-one.html',
        controller: function($scope, $state, $stateParams, StateSrv, VideosSrv, HostsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.hostId = $stateParams.hostId;
                $scope.host = HostsSrv.findById($scope.hostId);

                //videos
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { hosts: { filter: [$scope.hostId] } });
                $scope.videosOptions = {};

                $scope.$watch('host', function(newVal, oldVal) {
                    $scope.valid = HostsSrv.isValid($scope.host);

                    HostsSrv.save();
                }, true);

                StateSrv.watch($scope, ['videosOptions']);
            };

            $scope.delete = function(host) {
                HostsSrv.delete(({ id: host.id }));
                HostsSrv.save();
                $state.transitionTo('editor.videos.hosts.all');
            };
        }
    });
});
