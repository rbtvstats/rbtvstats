angular.module('app.data.videos').factory('VideosDataBackupSrv', function($filter, uuid4, VideosDataSrv) {
    var cache = null;
    var service = {};

    function generateId() {
        return uuid4.generate().substring(0, 4);
    }

    service.clear = function() {
        cache = cache || [];
        angular.copy([], cache);
    };

    service.loadLocal = function() {
        return localforage.getItem('backups')
            .then(function(data) {
                return service.load(data);
            });
    };

    service.load = function(backups) {
        service.clear();

        if (backups !== cache && angular.isArray(backups)) {
            angular.copy(backups, cache);
        }

        return cache;
    };

    service.save = _.debounce(function() {
        console.log('save backup');

        var allBackups = service.all();
        localforage.setItem('backups', allBackups);
    }, 1000);

    service.all = function() {
        return cache;
    };

    service.findById = function(id) {
        var allBackups = service.all();

        var result = $filter('filter')(allBackups, { id: id }, true);
        if (result.length === 1) {
            return result;
        }

        return null;
    };

    service.create = function() {
        var allBackups = service.all();
        var data = {};
        var dataServices = VideosDataSrv.getServices();
        _.map(dataServices, function(DataSrv) {
            data[DataSrv.id] = DataSrv.all();
        });

        var backup = {
            time: moment().unix(),
            hash: VideosDataSrv.hash(),
            data: data
        };

        while (!backup.id) {
            var id = generateId();
            if (!service.findById(id)) {
                backup.id = id;
            }
        }

        allBackups.push(backup);
    };

    service.restore = function(backup) {
        _.forOwn(backup.data, function(data, id) {
            var DataSrv = VideosDataSrv.getService(id);
            if (DataSrv) {
                DataSrv.load(data);
            }
        });
    };

    service.delete = function(backup) {
        var allBackups = service.all();

        for (var i = 0; i < allBackups.length; i++) {
            if (allBackups[i].id === backup.id) {
                allBackups.splice(i, 1);
            }
        }
    };

    service.clear();

    return service;
});
