angular.module('app.editor').directive('navigation', function() {
    return {
        restrict: 'A',
        templateUrl: 'app/editor/views/navigation/navigation.html',
        controller: function($scope, $location) {
            $scope.isActive = function(viewLocation) {
                return $location.path().indexOf(viewLocation) === 0;
            };
        }
    };
});
