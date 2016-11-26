'use strict';

/**
 * @ngdoc directive
 * @name rbtvCrawlerApp.directive:select
 * @description
 * # select
 */
app.directive('select', function($parse) {
    return {
        restrict: 'A',
        require: 'uiSelect',
        link: function postLink(scope, element, attrs, $select) {
            var idModel = $parse(attrs.ngModel);
            var refModel = $parse(attrs.select);

            scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                refModel.assign(scope.$parent, $select.selected);
            });

            scope.$watch(attrs.select + '.id', function(newVal, oldVal) {
                idModel.assign(scope, newVal);
            });
        }
    };
});
