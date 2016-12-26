angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.shows.all', {
        url: '/',
        templateUrl: 'app/editor/videos/shows/shows-all/shows-all.html',
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
                        template: 'app/editor/videos/shows/shows-all/shows-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/editor/videos/shows/shows-all/shows-all-card.html'
                    }]
                };
                $scope.exec = {
                    code: 'console.log(show);'
                };

                StateSrv.watch($scope, ['exec']);
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
