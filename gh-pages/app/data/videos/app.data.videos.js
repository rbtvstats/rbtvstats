angular.module('app.data.videos', [
    'uuid4'
]);

angular.module('app.data.videos').run(function(VideosDataSrv) {
    VideosDataSrv.init();
});
