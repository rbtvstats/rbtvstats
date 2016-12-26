angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.channels.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/channels/channels-all/channels-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, ChartTemplatesSrv, VideosSrv, ChannelsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { online: true });
                $scope.channels = ChannelsSrv.all();
                $scope.table = {
                    header: {
                        title: 'Kanäle'
                    },
                    params: new NgTableParams({}, {
                        dataset: $scope.channels
                    }),
                    options: {
                        display: {
                            view: 'list',
                            count: 10
                        },
                        order: {
                            column: 'title',
                            type: 'asc'
                        },
                        filter: ''
                    },
                    views: [{
                        id: 'list',
                        name: 'Liste',
                        icon: 'fa-th-list',
                        template: 'app/viewer/videos/channels/channels-all/channels-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/viewer/videos/channels/channels-all/channels-all-card.html'
                    }]
                };

                function key(data) {
                    return ChannelsSrv.findById(data.target).title;
                }

                $scope.charts = [];
                $scope.charts.push(ChartTemplatesSrv.videosCountByDate($scope.videos, key, 'channel'));
                $scope.charts.push(ChartTemplatesSrv.videosDurationByDate($scope.videos, key, 'channel'));
                $scope.charts.push(ChartTemplatesSrv.videosViewsTotalByDate($scope.videos, key, 'channel'));
                $scope.charts.push(ChartTemplatesSrv.videosViewsDistribution($scope.videos, key, 'channel'));
            };
        }
    });
});
