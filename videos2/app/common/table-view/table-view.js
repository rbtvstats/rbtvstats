angular.module('app.common').directive('tableView', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/common/table-view/table-view.html',
        controller: function($scope, $rootScope) {
            $scope.init = function() {
                $scope.displayCountOptions = [10, 25, 50];

                //sync: options -> table.params
                $scope.$watchCollection('table.options.order', function(newVal, oldVal) {
                    $scope.table.params.sorting($scope.table.options.order.column, $scope.table.options.order.type);
                });

                $scope.$watch('table.options.display.count', function(newVal, oldVal) {
                    $scope.table.params.count($scope.table.options.display.count);
                });

                $scope.$watch('table.options.filter', function(newVal, oldVal) {
                    $scope.table.params.filter({ $: $scope.table.options.filter });
                });

                //sync: table.params -> options
                $scope.$watch('table.params.sorting()', function(newVal, oldVal) {
                    var sorting = $scope.table.params.sorting();
                    for (var column in sorting) {
                        $scope.table.options.order.column = column;
                        $scope.table.options.order.type = sorting[column];
                        break;
                    }
                });

                $scope.$watch('table.params.count()', function(newVal, oldVal) {
                    $scope.table.options.display.count = $scope.table.params.count();
                });

                $scope.$watch('table.params.filter()', function(newVal, oldVal) {
                    $scope.table.options.filter = $scope.table.params.filter().$ || '';
                });
            };

            $scope.init();
        }
    };
});
