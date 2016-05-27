'use strict';

/**
 * @ngdoc directive
 * @name rbtvstatsApp.directive:stat
 * @description
 * # stat
 */
app.directive('stat', function() {
    return {
        templateUrl: 'views/template-stat.html',
        restrict: 'A',
        scope: {
            value: '=stat'
        },
        controller: function($scope) {
            $scope.getType = function(obj) {
                if ($.isArray(obj)) {
                    return 'array';
                } else {
                    return typeof obj;
                }
            };
        }
    };
});
