angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.shows.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/shows/shows-all/shows-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, ShowsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.shows = ShowsSrv.all();
                $scope.table = {
                    header: {
                        title: 'Formate'
                    },
                    params: new NgTableParams({}, {
                        dataset: $scope.shows
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
                        template: 'app/viewer/videos/shows/shows-all/shows-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/viewer/videos/shows/shows-all/shows-all-card.html'
                    }]
                };
            };
        }
    });
});
