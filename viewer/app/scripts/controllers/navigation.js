'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('NavigationCtrl', function($scope, $location) {
    $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
});
