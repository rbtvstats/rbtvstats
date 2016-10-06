'use strict';

/**
 * @ngdoc function
 * @name rbtvstatsApp.controller:FlagCtrl
 * @description
 * # FlagCtrl
 * Controller of the rbtvstatsApp
 */
app.controller('FlagCtrl', function($scope, $uibModalInstance) {
    $scope.init = function() {
        $scope.reasons = [{
            id: 'hosts',
            title: 'Moderator(en) fehlerhaft oder unvollständig',
            selected: false
        }, {
            id: 'shows',
            title: 'Format(e) fehlerhaft oder unvollständig',
            selected: false
        }];
        $scope.description = '';
    };

    $scope.ok = function() {
        var reasons = [];
        for (var i = 0; i < $scope.reasons.length; i++) {
            var reason = $scope.reasons[i];
            if (reason.selected === true) {
                reasons.push(reason.id);
            }
        }

        $scope.description = $scope.description.trim();
        if ($scope.description) {
            reasons.push('description: ' + $scope.description);
        }

        $uibModalInstance.close(reasons);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});
