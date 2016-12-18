angular.module('app.common').directive('tableViewOptions', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/common/table-view/table-view-options/table-view-options.html',
        controller: function($scope) {

        }
    };
});
