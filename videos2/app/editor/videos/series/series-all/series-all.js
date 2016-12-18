angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.series.all', {
        url: '/',
        templateUrl: 'app/editor/videos/series/series-all/series-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.series = SeriesSrv.all();
                $scope.table = {
                    header: {
                        title: 'Serien',
                        add: $scope.add
                    },
                    params: new NgTableParams({}, {
                        dataset: $scope.series
                    }),
                    options: {
                        display: {
                            view: 'list',
                            count: 10
                        },
                        order: {
                            column: 'name',
                            type: 'asc'
                        },
                        filter: ''
                    },
                    views: [{
                        id: 'list',
                        name: 'Liste',
                        icon: 'fa-th-list',
                        template: 'app/editor/videos/series/series-all/series-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/editor/videos/series/series-all/series-all-card.html'
                    }]
                };

                StateSrv.watch($scope, ['tableOptions', 'exec']);
            };

            $scope.one = function(series) {
                $state.transitionTo('editor.videos.series.one', { seriesId: series.id });
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

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.series, function(series) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };

            $scope.update = function() {
                $scope.table.params.reload();
            };
        }
    });
});
