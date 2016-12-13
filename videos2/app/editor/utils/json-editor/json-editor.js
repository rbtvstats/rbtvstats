angular.module('app.editor').directive('jsonEditor', function() {
    return {
        restrict: 'A',
        scope: {
            data: '=jsonEditor'
        },
        templateUrl: 'app/editor/utils/json-editor/json-editor.html',
        controller: function($scope) {
            $scope.editor = {
                data: null,
                options: {
                    expanded: true
                }
            };

            $scope.$watch('data', function(newVal, oldVal) {
                $scope.editor.data = angular.copy($scope.data);
            }, true);

            $scope.$watch('editor.data', function(newVal, oldVal) {
                angular.copy($scope.editor.data, $scope.data);
            });
        }
    };
});
