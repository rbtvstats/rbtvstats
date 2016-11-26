'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:JsonEditorCtrl
 * @description
 * # JsonEditorCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('JsonEditorCtrl', function($scope) {
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
});
