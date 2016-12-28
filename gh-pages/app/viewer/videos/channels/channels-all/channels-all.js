angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.channels.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/channels/channels-all/channels-all.html',
        controller: function($scope, $state, StateSrv, ChartTemplatesSrv, VideosSrv, ChannelsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.channels = ChannelsSrv.all();
                $scope.channelsOptions = {
                    display: {
                        view: 'card',
                        count: 10
                    },
                    order: {
                        column: 'title',
                        type: 'asc'
                    },
                    filter: ''
                };

                //videos
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { online: true });

                function key(data) {
                    return ChannelsSrv.findById(data.target).title;
                }

                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosCountByDate($scope.videos, key, 'channel'));
                $scope.charts.push(ChartTemplatesSrv.videosDurationByDate($scope.videos, key, 'channel'));
                $scope.charts.push(ChartTemplatesSrv.videosViewsTotalByDate($scope.videos, key, 'channel'));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, key, 'channel'));

                StateSrv.watch($scope, ['channelsOptions']);
            };
        }
    });
});
