var registeredVideoDataServices = {};

function registerVideoDataService(id, service) {
    registeredVideoDataServices[id] = service;
}

angular.module('app.data.videos').service('VideosDataSrv', function($http, $q, $injector, md5, ConfigSrv) {
    var service = {};
    var cacheMetadata = null;

    var dataServices = [];
    var dataServicesIndexed = {};

    service.init = function() {
        dataServices = [];
        dataServicesIndexed = {};

        for (var key in registeredVideoDataServices) {
            var DataSrv = $injector.get(registeredVideoDataServices[key]);
            dataServices.push(DataSrv);
            dataServicesIndexed[key] = DataSrv;
        }
    };

    service.save = function() {
        _.map(dataServices, function(DataSrv) {
            return DataSrv.save();
        });
    };

    service.loadRemoteMetadata = function(cache) {
        var url = urljoin(ConfigSrv.get('githubBaseUrl'), ConfigSrv.get('githubRepository'), ConfigSrv.get('githubBranch'), ConfigSrv.get('videosPath'), '/metadata.json?' + moment().unix());
        return $http.get(url)
            .then(function(response) {
                cacheMetadata = response.data;

                return cacheMetadata;
            });
    };

    service.metadata = function() {
        return cacheMetadata;
    };

    service.loadRemote = function() {
        var promises = _.map(dataServices, function(DataSrv) {
            DataSrv.clear();
            return DataSrv.loadRemote();
        });

        return $q.all(promises)
            .then(function(results) {
                return;
            });
    };

    service.loadLocal = function() {
        var promises = _.map(dataServices, function(DataSrv) {
            DataSrv.clear();
            return DataSrv.loadLocal();
        });

        return $q.all(promises)
            .then(function(results) {
                return;
            });
    };

    service.getServices = function() {
        return dataServices;
    };

    service.getService = function(id) {
        return dataServicesIndexed[id];
    };

    service.hash = function() {
        var data = _.map(dataServices, function(DataSrv) {
            return [DataSrv.all(), DataSrv.schema];
        });
        var str = angular.toJson(data, true);

        return md5.createHash(str);
    };

    return service;
});
