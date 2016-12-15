angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.shows.all', {
        url: '/',
        templateUrl: 'app/editor/videos/shows/shows-all/shows-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, ShowsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.shows = ShowsSrv.all();
                $scope.tableParams = new NgTableParams({
                    sorting: {
                        name: 'asc'
                    },
                    count: 25
                }, {
                    dataset: $scope.shows,
                    counts: []
                });
                $scope.tableOptions = {
                    display: {
                        view: 'list',
                        count: 25
                    }
                };
                $scope.exec = {
                    code: 'console.log(show);'
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

                StateSrv.watch($scope, ['tableOptions', 'exec']);
            };

            $scope.one = function(show) {
                $state.transitionTo('editor.videos.shows.one', { showId: show.id });
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

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.shows, function(show) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };

            $scope.update = function() {
                $scope.tableParams.reload();
            };
        }
    });
});
