angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.shows.one', {
        url: '/:showId',
        templateUrl: 'app/editor/views/shows/shows-one/shows-one.html',
        controller: function($scope, $state, $stateParams, InitSrv, ShowsSrv) {
            $scope.init = function() {
                $scope.show = ShowsSrv.findById($stateParams.showId);

                $scope.$watch('show', function(newVal, oldVal) {
                    $scope.valid = ShowsSrv.isValid($scope.show);

                    ShowsSrv.save();
                }, true);
            };

            $scope.delete = function(show) {
                ShowsSrv.delete(({ id: show.id }));
                ShowsSrv.save();
                $state.transitionTo('editor.shows.all');
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
