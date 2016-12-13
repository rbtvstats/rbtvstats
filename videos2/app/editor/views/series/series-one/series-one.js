angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.series.one', {
        url: '/:seriesId',
        templateUrl: 'app/editor/views/series/series-one/series-one.html',
        controller: function($scope, $state, $stateParams, InitSrv, SeriesSrv) {
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
                $state.transitionTo('editor.series.all');
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
