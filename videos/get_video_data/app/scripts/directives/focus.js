'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.directive:focus
 * @description
 * # focus
 * Directive of the rbtvstatsApp
 */
app.directive('focus', function() {
    return {
        scope: {
            focus: '='
        },
        link: function($scope, $element) {
            $scope.$watch('focus', function(state) {
                if (state && $element.length) {
                    $element[0].focus();
                    $element[0].select();
                }
            });
        }
    };
});
