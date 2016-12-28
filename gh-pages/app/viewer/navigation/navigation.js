angular.module('app.viewer').controller('NavigationCtrl', function($scope, $q, InitSrv, VideosDataSrv, LiveDataSrv) {
    var videoMetadata = {
        name: 'Video Daten',
        loading: true
    };

    var liveMetadata = {
        name: 'Live Daten',
        loading: true
    };

    $scope.metadata = [videoMetadata, liveMetadata];

    var promises = [];

    //videos data
    promises.push(InitSrv.wait('videos-metadata')
        .then(function() {
            var metadata = VideosDataSrv.metadata();

            videoMetadata.loading = false;
            videoMetadata.update = metadata.update;
        })
        .catch(function() {
            videoMetadata.error = true;
        }));

    //live data
    promises.push(InitSrv.wait('live-metadata')
        .then(function() {
            var metadata = LiveDataSrv.metadata();

            liveMetadata.loading = false;
            liveMetadata.update = metadata.update;
        })
        .catch(function() {
            liveMetadata.error = true;
        }));

    $q.all(promises)
        .then(function() {
            $scope.initialized = true;
        });
});
