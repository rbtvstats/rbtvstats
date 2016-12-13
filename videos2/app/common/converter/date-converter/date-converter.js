angular.module('app.common').directive('dateConverter', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            var modelOriginal = $parse(attrs.ngModel);
            var modelTarget = $parse(attrs.dateConverter);

            var single;
            scope.$watch(attrs.options + '.singleDatePicker', function(newVal, oldVal) {
                single = newVal;
            });

            modelOriginal.assign(scope, 0);

            scope.$watch(attrs.dateConverter, function(newVal, oldVal) {
                var start = 0;
                var end = 0;

                if (single === true) {
                    if (newVal > 0) {
                        start = moment.unix(newVal);
                    }

                    modelOriginal.assign(scope, start);
                } else {
                    if (newVal.startDate > 0) {
                        start = moment.unix(newVal.startDate);
                    }
                    if (newVal.endDate > 0) {
                        end = moment.unix(newVal.endDate);
                    }

                    var obj = modelOriginal(scope);
                    if (!angular.isObject(obj)) {
                        obj = {};
                    }
                    obj.startDate = start;
                    obj.endDate = end;

                    modelOriginal.assign(scope, obj);
                }
            });

            scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                if (single === true) {
                    modelTarget.assign(scope, moment(newVal).unix());
                } else {
                    modelTarget.assign(scope, {
                        startDate: moment(newVal.startDate).unix(),
                        endDate: moment(newVal.endDate).unix()
                    });
                }
            });
        }
    };
});
