angular.module('app.common').directive('tablePagination', function(ngTableEventsChannel) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            tableParams: '=tablePagination',
            align: '='
        },
        templateUrl: 'app/common/table-pagination/table-pagination.html',
        controller: function($scope) {
            $scope.init = function() {
                $scope.pagination = {};

                ngTableEventsChannel.onPagesChanged($scope.syncPagination, $scope, $scope.tableParams);
                ngTableEventsChannel.onAfterReloadData($scope.syncPagination, $scope, $scope.tableParams);
                ngTableEventsChannel.onDatasetChanged($scope.syncPagination, $scope, $scope.tableParams);

                $scope.syncPagination();
            };

            $scope.prev = function() {
                $scope.page($scope.pagination.current - 1);
            };

            $scope.next = function() {
                $scope.page($scope.pagination.current + 1);
            };

            $scope.page = function(page) {
                $scope.tableParams.page(page);
            };

            $scope.syncPagination = function() {
                if (angular.isObject($scope.tableParams)) {
                    var prevTotal = $scope.pagination.total;
                    
                    $scope.pagination.current = $scope.tableParams.page();
                    $scope.pagination.count = $scope.tableParams.count();
                    $scope.pagination.total = Math.ceil($scope.tableParams.total() / $scope.pagination.count);
                    $scope.pagination.first = $scope.pagination.current <= 1;
                    $scope.pagination.last = $scope.pagination.current >= $scope.pagination.total;

                    if ($scope.pagination.total !== prevTotal) {
                        $scope.pagination.options = _.range(1, $scope.pagination.total + 1);
                    }
                }
            };

            $scope.init();
        }
    };
});
