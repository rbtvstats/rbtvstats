angular.module('app.data').service('FirebaseApi', function($http, uuid4) {
    var baseUrl = 'https://rbtv-report.firebaseio.com/';
    var service = {};

    service.create = function(data) {
        return $http.put(baseUrl + uuid4.generate() + '.json', data)
            .then(function(response) {
                return response;
            });
    };

    return service;
});
