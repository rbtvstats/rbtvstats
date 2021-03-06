angular.module('app', [
    'app.common',
    'app.data',
    'app.editor',
    'app.viewer',
    'ui.router',
    'angular-loading-bar',
    'ui-notification'
]);

function benchmark(func, run) { //TODO remove
    if (run !== false) {
        setTimeout(function() {
            var benchmarks = [];
            setInterval(function() {
                var t0 = performance.now();

                func();

                var t1 = performance.now();
                benchmarks.push(t1 - t0);

                if (benchmarks.length % 10 === 0) {
                    console.log('average execution time: ' + _.mean(benchmarks));
                }
            }, 100);
        }, 1000);
    }
}

angular.module('app').config(function($urlRouterProvider, NotificationProvider, cfpLoadingBarProvider, $tooltipProvider, $timepickerProvider, $datepickerProvider, $modalProvider) {
    $urlRouterProvider.rule(function($injector, $location) {
        var path = $location.url();

        // check to see if the path already has a slash where it should be
        if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
            return;
        }

        if (path.indexOf('?') > -1) {
            return path.replace('?', '/?');
        }

        return path + '/';
    });

    NotificationProvider.setOptions({
        delay: 3000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top'
    });

    cfpLoadingBarProvider.latencyThreshold = 500;

    angular.extend($tooltipProvider.defaults, {
        container: 'body'
    });

    angular.extend($timepickerProvider.defaults, {
        container: 'body',
        timeFormat: 'HH:mm',
        length: 3,
        useNative: false,
        timeType: 'unix',
        iconUp: 'fa fa-fw fa-chevron-up',
        iconDown: 'fa fa-fw fa-chevron-down'
    });

    angular.extend($datepickerProvider.defaults, {
        container: 'body',
        useNative: false,
        dateType: 'unix',
        iconLeft: 'fa fa-fw fa-chevron-left',
        iconRight: 'fa fa-fw fa-chevron-right'
    });

    angular.extend($modalProvider.defaults, {
        container: 'body'
    });
});

angular.module('app').run(function($rootScope, amMoment, Notification, $parse) {
    $rootScope.imagePlaceholders = {};
    $rootScope.imagePlaceholders.video = 'data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//EABQQAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQEAAQUCZj//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAEDAQE/AWY//8QAFBEBAAAAAAAAAAAAAAAAAAAAkP/aAAgBAgEBPwFmP//EABQQAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQEABj8CZj//xAAUEAEAAAAAAAAAAAAAAAAAAACQ/9oACAEBAAE/IWY//9oADAMBAAIAAwAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAEDAQE/EGY//8QAFBEBAAAAAAAAAAAAAAAAAAAAkP/aAAgBAgEBPxBmP//EABQQAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQEAAT8QZj//2Q==';
    $rootScope.imagePlaceholders.channel = 'data:image/jpeg;base64,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';
    $rootScope.imagePlaceholders.show = $rootScope.imagePlaceholders.channel;
    $rootScope.imagePlaceholders.host = $rootScope.imagePlaceholders.channel;
    $rootScope.imagePlaceholders.series = $rootScope.imagePlaceholders.channel;

    //locale
    amMoment.changeLocale('de');

    var d3GermanFormat = d3.locale({
        decimal: ',',
        thousands: '.',
        grouping: [3],
        currency: ['€', ''],
        dateTime: '%a %b %e %X %Y',
        date: '%d.%m.%Y',
        time: '%H:%M:%S',
        periods: ['AM', 'PM'],
        days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        months: ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Dez']
    });
    d3.format = d3GermanFormat.numberFormat;
    d3.time.format = d3GermanFormat.timeFormat;

    //angular assign without copy
    angular.assign = function(source, target, clear) {
        if (angular.isUndefined(clear)) {
            clear = true;
        }

        if (typeof(source) === typeof(target)) {
            if (angular.isArray(source)) {
                if (clear) {
                    target.length = 0;
                }

                for (var i = 0; i < source.length; i++) {
                    target.push(source[i]);
                }
            } else if (angular.isObject(source)) {
                if (clear) {
                    angular.copy({}, target);
                }

                for (var key in source) {
                    target[key] = source[key];
                }
            }
        }
    };

    angular.isBoolean = function(v) {
        return typeof(v) === 'boolean';
    };

    //extend notification service
    Notification.parseError = function(options) {
        options.message = 'Unbekannter Fehler';

        //error string
        if (angular.isString(options.err)) {
            options.message = options.err;
        }
        //exception
        else if (options.err instanceof Error) {
            options.message = options.err.message || options.message;
        }
        //some object
        else if (angular.isObject(options.err)) {
            options.message = '';

            //network error
            if (angular.isNumber(options.err.status)) {
                options.message = '<div>Status ' + options.err.status + '</div>';
            }

            //extract the message
            if (angular.isString(options.errPath)) {
                var data = $parse(options.errPath)(options.err);
                if (data) {
                    options.message += data;
                }
            }
        }

        return options;
    };

    _.mixin({
        groupByArray: function(collection, iteratee) {
            iteratee = _.iteratee(iteratee);

            var result = {};
            var targets;
            var target;
            var i;
            _.each(collection, function(value, key) {
                targets = iteratee(value);
                if (!angular.isArray(targets)) {
                    targets = [targets];
                }

                for (i = 0; i < targets.length; i++) {
                    target = targets[i];
                    if (result.hasOwnProperty(target)) {
                        result[target].push(value);
                    } else {
                        result[target] = [value];
                    }
                }
            });

            return result;
        }
    });

    var domainIcons = {
        'rocketbeans.tv': 'c-icon c-icon-bohne',
        'forum.rocketbeans.tv': 'c-icon c-icon-bohne',
        'bohnenwiki.de': 'c-icon c-icon-bohne',
        'twitter.com': 'fa fa-colored fa-twitter',
        'reddit.com': 'fa fa-colored fa-reddit',
        'twitch.tv': 'fa fa-colored fa-twitch',
        'youtube.com': 'fa fa-colored fa-youtube-play',
        'igdb.com': 'fa fa-colored fa-gamepad'
    };

    $rootScope.getDomain = function(link) {
        var domain = url('domain', link);
        var subdomain = url('sub', link);

        if (subdomain) {
            domain = subdomain + '.' + domain;
        }

        domain = domain.replace(/^www./, '');

        return domain;
    };

    $rootScope.getDomainIcon = function(link) {
        var domain = $rootScope.getDomain(link);
        var icon = domainIcons[domain];
        if (!icon) {
            icon = 'fa fa-colored fa-external-link';
        }

        return icon;
    };

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
});
