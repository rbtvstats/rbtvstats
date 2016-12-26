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
                        title: 'Serien'
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
                $scope.exec = {
                    code: 'console.log(series);'
                };

                StateSrv.watch($scope, ['exec']);
            };

            $scope.add = function() {
                var series = SeriesSrv.create();
                SeriesSrv.save();
                $state.transitionTo('editor.videos.series.one', { seriesId: series.id });
            };

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.series, function(series) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };
        }
    });
});
