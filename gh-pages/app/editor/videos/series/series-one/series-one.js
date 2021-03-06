angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.series.one', {
        url: '/:seriesId',
        templateUrl: 'app/editor/videos/series/series-one/series-one.html',
        controller: function($scope, $state, $stateParams, Notification, StateSrv, IgdbApiSrv, VideosSrv, ShowsSrv, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.seriesId = $stateParams.seriesId;
                $scope.series = SeriesSrv.findById($scope.seriesId);
                $scope.shows = ShowsSrv.all();

                //videos
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { series: { filter: [$scope.seriesId] } });
                $scope.videosOptions = {};

                $scope.$watch('series', function(newVal, oldVal) {
                    $scope.valid = SeriesSrv.isValid($scope.series);

                    SeriesSrv.save();
                }, true);

                StateSrv.watch($scope, ['videosOptions']);
            };

            $scope.delete = function(series) {
                SeriesSrv.delete(({ id: series.id }));
                SeriesSrv.save();
                $state.transitionTo('editor.videos.series.all');
            };

            $scope.fetchGameMetadata = function(series, search) {
                IgdbApiSrv.games(search)
                    .then(function(data) {
                        $scope.gameMetadataOptions = data;
                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Abrufen der Videospiel Informationen',
                            err: err,
                            errPath: 'data.message',
                            delay: null
                        }));
                    });
            };

            $scope.setGameMetadata = function(series, metadata) {
                series.description = metadata.summary || '';
                if (metadata.cover) {
                    series.image = 'http:' + metadata.cover.url.replace('t_thumb', 't_thumb_2x');
                }
                series.links.length = 0;
                series.links.push(metadata.url.replace('www.', ''));
            };
        }
    });
});
