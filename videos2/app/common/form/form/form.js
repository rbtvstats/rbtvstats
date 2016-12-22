angular.module('app.common').directive('form', function() {
    return {
        restrict: 'A',
        //replace: true,
        transclude: true,
        scope: {
            cols: '='
        },
        templateUrl: 'app/common/form/form/form.html',
        link: function(scope, element, attrs, fn, transclude) {
            var content = element.find('.content');
            content.append(transclude());
        }
    };
});
