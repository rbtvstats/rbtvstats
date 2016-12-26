angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.shows.one', {
        url: '/:showId',
        templateUrl: 'app/editor/videos/shows/shows-one/shows-one.html',
        controller: function($scope, $state, $stateParams, VideosSrv, ShowsSrv, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.showId = $stateParams.showId;
                $scope.show = ShowsSrv.findById($scope.showId);
                $scope.series = SeriesSrv.all();
                $scope.videos = VideosSrv.filter(VideosSrv.all(), { shows: { filter: [$scope.showId] } });

                $scope.$watch('show', function(newVal, oldVal) {
                    $scope.valid = ShowsSrv.isValid($scope.show);

                    ShowsSrv.save();
                }, true);
            };

            $scope.delete = function(show) {
                ShowsSrv.delete(({ id: show.id }));
                ShowsSrv.save();
                $state.transitionTo('editor.videos.shows.all');
            };

            $scope.addSeries = function(show, series) {
                ShowsSrv.addSeries(show, series);
            };

            $scope.removeSeries = function(show, series) {
                ShowsSrv.removeSeries(show, series);
            };
        }
    });
});
