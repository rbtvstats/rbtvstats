angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.series.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/series/series-all/series-all.html',
        controller: function($scope, $state, NgTableParams, InitSrv, StateSrv, SeriesSrv) {
            $scope.init = function() {
                $scope.series = SeriesSrv.all();
                $scope.tableParams = new NgTableParams({
                    sorting: {
                        name: 'asc'
                    },
                    count: 10
                }, {
                    dataset: $scope.series,
                    counts: []
                });
                $scope.tableOptions = {
                    display: {
                        view: 'list',
                        count: 10
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
                $state.transitionTo('viewer.videos.series.one', { seriesId: series.id });
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
