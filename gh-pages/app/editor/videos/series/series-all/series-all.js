angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.series.all', {
        url: '/',
        templateUrl: 'app/editor/videos/series/series-all/series-all.html',
        controller: function($scope, $state, StateSrv, SeriesSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.series = SeriesSrv.all();
                $scope.seriesOptions = {
                    display: {
                        view: 'list',
                        count: 10
                    },
                    order: {
                        column: 'name',
                        type: 'asc'
                    },
                    filter: ''
                };
                $scope.exec = {
                    code: 'console.log(series);'
                };

                StateSrv.watch($scope, ['seriesOptions', 'exec']);
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
