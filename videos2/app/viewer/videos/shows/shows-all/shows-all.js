angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.shows.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/shows/shows-all/shows-all.html',
        controller: function($scope, $state, StateSrv, ShowsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.shows = ShowsSrv.all();
                $scope.showsOptions = {
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

                StateSrv.watch($scope, ['showsOptions']);
            };
        }
    });
});
