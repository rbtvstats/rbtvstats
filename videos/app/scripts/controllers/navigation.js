'use strict';

/**
 * @ngdoc function
 * @name rbtvCrawlerApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the rbtvCrawlerApp
 */
app.controller('NavigationCtrl', function($scope, $location) {
    $scope.isActive = function(viewLocation) {
        return $location.path().indexOf(viewLocation) == 0;
    };
});
