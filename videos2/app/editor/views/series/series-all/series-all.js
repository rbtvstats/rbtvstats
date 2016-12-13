angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.series.all', {
        url: '/',
        templateUrl: 'app/editor/views/series/series-all/series-all.html',
        controller: function($scope, $state, NgTableParams, InitSrv, StateSrv, SeriesSrv) {
            $scope.init = function() {
                $scope.series = SeriesSrv.all();
                $scope.tableParams = new NgTableParams({
                    sorting: {
                        name: 'asc'
                    },
                    count: 25
                }, {
                    dataset: $scope.series,
                    counts: []
                });
                $scope.tableOptions = {
                    display: {
                        view: 'list',
                        count: 25
                    }
                };

                //view
                $scope.displayViewOptions = [
                    { value: 'list', name: 'Liste', icon: 'fa-th-list' },
                    { value: 'card', name: 'Kacheln', icon: 'fa-th-large' }
                ];
                $scope.displayCountOptions = [10, 25, 50];

                $scope.$watchCollection('tableOptions.display', function(newVal, oldVal) {
                    $scope.tableParams.count($scope.tableOptions.display.count);
                });

                StateSrv.watch($scope, ['tableOptions']);
            };

            $scope.one = function(series) {
                $state.transitionTo('editor.series.one', { seriesId: series.id });
            };

            $scope.add = function() {
                var series = SeriesSrv.create();
                SeriesSrv.save();
                $scope.one(series);
            };

            $scope.delete = function(series) {
                SeriesSrv.delete({ id: series.id });
                SeriesSrv.save();
                $scope.update();
            };

            $scope.update = function() {
                $scope.tableParams.reload();
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
