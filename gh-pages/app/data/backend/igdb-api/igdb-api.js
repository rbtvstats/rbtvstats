angular.module('app.data').service('IgdbApiSrv', function($http, ConfigSrv) {
    var baseUrl = 'https://igdbcom-internet-game-database-v1.p.mashape.com/';
    var service = {};

    function key() {
        return ConfigSrv.get('igdbApiKey');
    }

    service.games = function(search, fields, limit, offset) {
        if (!angular.isArray(fields)) {
            fields = ['url', 'name', 'summary', 'cover'];
        }

        if (!angular.isNumber(limit)) {
            limit = 10;
        }

        if (!angular.isNumber(offset)) {
            offset = 0;
        }

        fields = fields.join(',');

        return $http({
                method: 'GET',
                url: baseUrl + 'games/?fields=' + fields + '&limit=' + limit + '&offset=' + offset + '&search=' + search,
                headers: {
                    'X-Mashape-Key': key()
                }
            })
            .then(function(response) {
                return response.data;
            });
    };

    return service;
});
