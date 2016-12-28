angular.module('app.common').directive('formElement', function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            key: '=',
            name: '='
        },
        templateUrl: 'app/common/form/form-element/form-element.html',
        link: function(scope, element, attrs, fn, transclude) {
            var content = element.find('.content');
            content.append(transclude());

            var input = content.find('input').first();
            input.attr('id', scope.key);
            input.attr('name', scope.key);
        }
    };
});
