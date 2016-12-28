angular.module('app.common').directive('report', function($tooltip, $modal) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, f) {
            $tooltip(element, { title: 'Fehler melden' });

            element.on('click', function() {
                var newScope = scope.$new();
                newScope.target = attrs.report;
                newScope.id = attrs.reportId;
                var modal = $modal({
                    templateUrl: 'app/common/report/report.html',
                    controller: 'ReportCtrl',
                    scope: newScope,
                    show: true
                });
            });
        }
    };
});

angular.module('app.common').controller('ReportCtrl', function($scope, Notification, FirebaseApi) {
    $scope.init = function() {
        var targets = {
            channels: [{
                id: 'description',
                title: 'Beschreibung'
            }, {
                id: 'links',
                title: 'Link(s)'
            }, {
                id: 'image',
                title: 'Bild'
            }],
            shows: [{
                id: 'name',
                title: 'Name'
            }, {
                id: 'description',
                title: 'Beschreibung'
            }, {
                id: 'links',
                title: 'Link(s)'
            }, {
                id: 'image',
                title: 'Bild'
            }],
            series: [{
                id: 'name',
                title: 'Name'
            }, {
                id: 'description',
                title: 'Beschreibung'
            }, {
                id: 'links',
                title: 'Link(s)'
            }, {
                id: 'image',
                title: 'Bild'
            }],
            hosts: [{
                id: 'name',
                title: 'Name'
            }, {
                id: 'links',
                title: 'Link(s)'
            }, {
                id: 'image',
                title: 'Bild'
            }],
            videos: [{
                id: 'shows',
                title: 'Format(e)'
            }, {
                id: 'hosts',
                title: 'Moderator(en)'
            }, {
                id: 'series',
                title: 'Serie(n)'
            }],
        };

        $scope.model = {
            description: '',
            reasons: targets[$scope.target]
        };
    };

    $scope.send = function() {
        var reasons = _($scope.model.reasons)
            .filter(function(reason) {
                return reason.selected === true;
            })
            .map(function(reason) {
                return reason.id;
            })
            .value();

        FirebaseApi.create({
                target: $scope.target,
                id: $scope.id,
                reasons: reasons,
                description: $scope.model.description
            })
            .then(function() {
                Notification.success({
                    message: 'Fehler erfolgreich gemeldet. Danke!'
                });
            })
            .catch(function() {
                Notification.error({
                    message: 'Fehler beim Melden',
                    delay: 5000
                });
            });
    };

    $scope.init();
});
