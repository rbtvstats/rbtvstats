angular.module('app.editor').controller('SeriesOneCtrl', function($scope, $timeout, $state, $stateParams, SeriesSrv) {
    $scope.init = function() {
        $scope.series = SeriesSrv.findById($stateParams.seriesId);

        $scope.$watch('series', function(newVal, oldVal) {
            $scope.valid = SeriesSrv.isValid($scope.series);

            SeriesSrv.save();
        }, true);

        $scope.initialized = true;
    };

    $scope.delete = function(series) {
        SeriesSrv.delete(({ id: series.id }));
        SeriesSrv.save();
        $state.transitionTo('editor.series.all');
    };

    $timeout($scope.init, 50);
});
