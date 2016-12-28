angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.shows.all', {
        url: '/',
        templateUrl: 'app/editor/videos/shows/shows-all/shows-all.html',
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
                $scope.exec = {
                    code: 'console.log(show);'
                };

                StateSrv.watch($scope, ['showsOptions', 'exec']);
            };

            $scope.add = function() {
                var show = ShowsSrv.create();
                ShowsSrv.save();
                $state.transitionTo('editor.videos.shows.one', { showId: show.id });
            };

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.shows, function(show) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };
        }
    });
});
