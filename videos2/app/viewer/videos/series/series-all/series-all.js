angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.series.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/series/series-all/series-all.html',
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
                        template: 'app/viewer/videos/series/series-all/series-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/viewer/videos/series/series-all/series-all-card.html'
                    }]
                };
            };

            $scope.toSeries = function(series) {
                $state.transitionTo('viewer.videos.series.one', { seriesId: series.id });
            };

            $scope.update = function() {
                $scope.table.params.reload();
            };
        }
    });
});
