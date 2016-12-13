angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.shows.all', {
        url: '/',
        templateUrl: 'app/viewer/views/shows/shows-all/shows-all.html',
        controller: function($scope, $state, NgTableParams, InitSrv, StateSrv, ShowsSrv) {
            $scope.init = function() {
                $scope.shows = ShowsSrv.all();
                $scope.tableParams = new NgTableParams({
                    sorting: {
                        name: 'asc'
                    },
                    count: 10
                }, {
                    dataset: $scope.shows,
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

            $scope.one = function(show) {
                $state.transitionTo('viewer.shows.one', { showId: show.id });
            };

            $scope.add = function() {
                var show = ShowsSrv.create();
                ShowsSrv.save();
                $scope.one(show);
            };

            $scope.delete = function(show) {
                ShowsSrv.delete({ id: show.id });
                ShowsSrv.save();
                $scope.update();
            };

            $scope.update = function() {
                $scope.tableParams.reload();
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
