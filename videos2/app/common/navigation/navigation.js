angular.module('app.common').directive('navigation', function(NavigationSrv) {
    return {
        restrict: 'A',
        templateUrl: 'app/common/navigation/navigation.html',
        controller: function($scope, $location) {
            $scope.navigation = NavigationSrv.all();

            $scope.isActive = function(viewLocation) {
                return $location.path().indexOf(viewLocation) === 0;
            };
        }
    };
});

angular.module('app.common').service('NavigationSrv', function() {
    var navigation = [];
    var service = {};

    service.clear = function() {
        navigation.length = 0;
    };

    service.register = function(path, name) {
        navigation.push({
            path: path,
            name: name
        });
    };

    service.all = function() {
        return navigation;
    };

    return service;
});
