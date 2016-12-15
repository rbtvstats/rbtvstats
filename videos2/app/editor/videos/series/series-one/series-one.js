angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.series.one', {
        url: '/:seriesId',
        templateUrl: 'app/editor/videos/series/series-one/series-one.html',
        controller: function($scope, $state, $stateParams, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.series = SeriesSrv.findById($stateParams.seriesId);

                $scope.$watch('series', function(newVal, oldVal) {
                    $scope.valid = SeriesSrv.isValid($scope.series);

                    SeriesSrv.save();
                }, true);
            };

            $scope.delete = function(series) {
                SeriesSrv.delete(({ id: series.id }));
                SeriesSrv.save();
                $state.transitionTo('editor.videos.series.all');
            };
        }
    });
});
