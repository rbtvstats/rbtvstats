angular.module('app.common').directive('tableView', function($compile) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            tableParams: '=tableView',
            tableOptions: '=tableViewOptions',
            data: '=tableViewData'
        },
        templateUrl: 'app/common/table-view/table-view.html',
        link: function(scope, element, attrs, fn, transclude) {
            scope.views = [];
            var root = transclude().parent();
            var tableOptions = root.attr('table-view-options');

            //title
            var titleEle = root.find('title').first();
            scope.title = titleEle.text();

            //view templates
            var templatesEle = root.find('[template]');
            templatesEle.each(function() {
                var ele = $(this);
                var view = {
                    id: ele.attr('id'),
                    name: ele.attr('name'),
                    icon: ele.attr('icon'),
                    template: ele.attr('template')
                };

                scope.views.push(view);

                ele.attr('id', null);
                ele.attr('name', null);
                ele.attr('icon', null);
                ele.attr('template', null);

                ele.attr('class', 'animate-table-view');
                ele.attr('ng-include', '\'' + view.template + '\'');
                ele.attr('ng-if', tableOptions + '.display.view === \'' + view.id + '\'');
            });

            var newEle = $compile(root.html())(scope.$parent);
            element.find('.views').append(newEle);
        },
        controller: function($scope, NgTableParams) {
            $scope.init = function() {
                //import from parent scope
                $scope.imagePlaceholders = $scope.$parent.imagePlaceholders;

                $scope.displayCountOptions = [10, 25, 50];

                $scope.tableParams = new NgTableParams({}, {
                    dataset: $scope.data
                });

                //sync: options -> tableParams
                $scope.$watchCollection('tableOptions.order', function(newVal, oldVal) {
                    $scope.tableParams.sorting($scope.tableOptions.order.column, $scope.tableOptions.order.type);
                });

                $scope.$watch('tableOptions.display.count', function(newVal, oldVal) {
                    $scope.tableParams.count($scope.tableOptions.display.count);
                });

                $scope.$watch('tableOptions.filter', function(newVal, oldVal) {
                    $scope.tableParams.filter({ $: $scope.tableOptions.filter });
                });

                $scope.$watch('tableOptions.display.page', function(newVal, oldVal) {
                    $scope.tableParams.page($scope.tableOptions.display.page);
                });

                //sync: tableParams -> options
                $scope.$watch('tableParams.sorting()', function(newVal, oldVal) {
                    var sorting = $scope.tableParams.sorting();
                    for (var column in sorting) {
                        $scope.tableOptions.order.column = column;
                        $scope.tableOptions.order.type = sorting[column];
                        break;
                    }
                });

                $scope.$watch('tableParams.count()', function(newVal, oldVal) {
                    $scope.tableOptions.display.count = $scope.tableParams.count();
                });

                $scope.$watch('tableParams.filter()', function(newVal, oldVal) {
                    $scope.tableOptions.filter = $scope.tableParams.filter().$ || '';
                });

                $scope.$watch('tableParams.page()', function(newVal, oldVal) {
                    $scope.tableOptions.display.page = $scope.tableParams.page();
                });
            };

            $scope.init();
        }
    };
});
