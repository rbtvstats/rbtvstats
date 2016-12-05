angular.module('app.editor').controller('ShowsOneCtrl', function($scope, $timeout, $state, $stateParams, ShowsSrv) {
    $scope.init = function() {
        $scope.show = ShowsSrv.findById($stateParams.showId);

        $scope.$watch('show', function(newVal, oldVal) {
            $scope.valid = ShowsSrv.isValid($scope.show);

            ShowsSrv.save();
        }, true);

        $scope.initialized = true;
    };

    $scope.delete = function(show) {
        ShowsSrv.delete(({ id: show.id }));
        ShowsSrv.save();
        $state.transitionTo('editor.shows.all');
    };

    $timeout($scope.init, 50);
});
