angular.module('app.data.videos').filter('videosResolve', function(VideosDataSrv) {
    return function(input, id) {
        var DataSrv = VideosDataSrv.getService(id);
        if (DataSrv) {
            return DataSrv.findById(input);
        }

        return input;
    };
});
