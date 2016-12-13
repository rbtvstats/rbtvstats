angular.module('app.common').directive('durationConverter', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function(value) {
                var date = new Date(value);

                return date.getHours() * 3600 + date.getMinutes() * 60;
            });

            ctrl.$formatters.push(function(value) {
                var date = new Date(value * 1000);
                date = new Date(date.getTime() + (60000 * date.getTimezoneOffset()));

                return date;
            });
        }
    };
});
