'use strict';

/**
 * @ngdoc service
 * @name rbtvstatsApp.flag
 * @description
 * # flag
 * Service in the rbtvstatsApp.
 */
app.service('FlagSrv', function($http, uuid4) {
    var service = {};

    service.flag = function(data) {
        return $http.put('https://rbtv-report.firebaseio.com/' + uuid4.generate() + '.json', data).then(function(response) {
            return response;
        });
    };

    return service;
});
