angular.module('app.common').directive('tableOptions', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/common/table-view/table-options/table-options.html',
        controller: function($scope) {
            $scope.init = function() {
                $scope.defaultOptions = {
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

                if (!angular.isObject($scope.tableOptions) || angular.equals({}, $scope.tableOptions)) {
                    $scope.resetOptions();
                }
            };

            $scope.resetOptions = function() {
                angular.copy($scope.defaultOptions, $scope.tableOptions);
            };

            $scope.init();
        }
    };
});
