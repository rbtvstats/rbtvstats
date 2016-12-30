angular.module('app.data.videos').service('DataBaseCtrl', function($rootScope, $filter, $timeout, $http, $q, uuid4, ConfigSrv, VideosDataSrv) {
    var Service = function() {
        var self = this;
        var cache = null;
        var cacheIndexed = null;

        self.id = 'UnknownId';
        this.name = 'UnknownName';
        self.schema = {};

        function getType(value) {
            if (angular.isUndefined(value)) {
                return 'undefined';
            } else if (value === null) {
                return 'null';
            } else if (angular.isArray(value)) {
                return 'array';
            } else if (angular.isObject(value)) {
                return 'object';
            }

            return typeof(value);
        }

        function arraysEqual(array1, array2) {
            if (array1 === array2) {
                return true;
            } else if (array1 == null || array2 == null) {
                return false;
            } else if (array1.length !== array2.length) {
                return false;
            }

            return _.every(array1, function(element) {
                return array2.indexOf(element) !== -1;
            });
        }

        function getRef(type) {
            if (angular.isString(type)) {
                if (type.charAt(0) === '$') {
                    return type.substring(1);
                }
            }

            return null;
        }

        function validateData(schema, data) {
            var dataType = getType(data);

            //is null allowed?
            if (schema.allowNull && dataType === 'null') {
                return true;
            }

            //is ref?
            var ref = getRef(schema.type);
            if (ref) {
                var DataSrv = VideosDataSrv.getService(ref);
                if (!DataSrv) {
                    return false;
                }

                var refData = DataSrv.findById(data);
                if (refData) {
                    return true; //possible: deep validation of reference -> "return DataSrv.isValid(refData);"
                } else {
                    return false;
                }
            }

            //valid type?
            if (schema.type !== dataType) {
                return false;
            }

            //is object?
            if (schema.type === 'object' && schema.properties) {
                if (!arraysEqual(Object.keys(schema.properties), Object.keys(data))) {
                    return false;
                }

                for (var key in schema.properties) {
                    if (!validateData(schema.properties[key], data[key])) {
                        return false;
                    }
                }
            }

            //is array?
            if (schema.type === 'array' && schema.arrayType) {
                for (var i = 0; i < data.length; i++) {
                    if (!validateData(schema.arrayType, data[i])) {
                        return false;
                    }
                }
            }

            return true;
        }

        function createData(schema, data) {
            var dataType = getType(data);

            //is null allowed?
            if (schema.allowNull && dataType === 'null') {
                return null;
            }

            //is ref?
            var ref = getRef(schema.type);
            if (ref) {
                var dataService = VideosDataSrv.getService(ref);
                if (!dataService) {
                    return angular.copy(schema.default);
                }

                var refData = dataService.findById(data);
                if (refData) {
                    return data;
                } else {
                    return angular.copy(schema.default);
                }
            }

            //is object?
            if (schema.type === 'object' && schema.properties) {
                if (dataType !== 'object') {
                    data = {};
                }

                var obj = {};
                for (var key in schema.properties) {
                    obj[key] = createData(schema.properties[key], data[key]);
                }

                return obj;
            }

            //is array?
            if (schema.type === 'array' && schema.arrayType) {
                if (dataType !== 'array') {
                    data = [];
                }

                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push(createData(schema.arrayType, data[i]));
                }

                return arr;
            }

            //valid type?
            if (schema.type === dataType) {
                return data;
            }

            //return default value
            return angular.copy(schema.default);
        }

        function generateId() {
            return uuid4.generate().substring(0, 4);
        }

        function buildIndex() {
            angular.copy({}, cacheIndexed);

            _.each(cache, function(data) {
                cacheIndexed[data.id] = data;
            });

            return cacheIndexed;
        }

        self.clear = function() {
            cache = cache || [];
            cacheIndexed = cacheIndexed || {};
            cache.length = 0;
            angular.copy({}, cacheIndexed);
        };

        self.loadRemote = function() {
            return VideosDataSrv.loadRemoteMetadata()
                .then(function(metadata) {
                    var baseUrl = urljoin(ConfigSrv.get('githubBaseUrl'), ConfigSrv.get('githubRepository'), ConfigSrv.get('githubBranch'), ConfigSrv.get('videosPath'));

                    //get remote file paths
                    var files = _.map(metadata.files[self.id], function(file) {
                        return urljoin(baseUrl, file);
                    });

                    //download all files
                    var promises = _.map(files, function(file) {
                        return $http.get(file);
                    });

                    return $q.all(promises);
                })
                .then(function(results) {
                    results = _.map(results, function(result) {
                        return result.data;
                    });
                    var data = _.flatten(results);

                    return self.load(data);
                });
        };

        self.loadLocal = function() {
            return localforage.getItem(self.id)
                .then(function(data) {
                    return self.load(data);
                });
        };

        self.load = function(data) {
            self.clear();

            if (data !== cache && angular.isArray(data)) {
                angular.copy(data, cache);
                buildIndex();
            }

            return cache;
        };

        self.save = _.debounce(function() {
            console.log('save ' + self.id);

            localforage.setItem(self.id, cache);
        }, 1000);

        self.total = function() {
            return cache.length;
        };

        self.isValid = function(value) {
            if (angular.isObject(value)) {
                var copy = angular.copy(value); //TODO hmm.. remove possible $$hash values
                return validateData(self.schema, copy);
            } else {
                return _.every(cache, function(data) {
                    return self.isValid(data);
                });
            }
        };

        self.force = function() {
            _.each(cache, function(data) {
                if (!self.isValid(data)) {
                    var newData = createData(self.schema, data);
                    angular.copy(newData, data);
                }
            });

            self.save();
        };

        self.all = function() {
            return cache;
        };

        self.findById = function(id) {
            if (angular.isString(id)) {
                return cacheIndexed[id];
            }

            if (angular.isArray(id)) {
                var result = [];
                for (var i = 0; i < id.length; i++) {
                    var found = cacheIndexed[id[i]];
                    if (found) {
                        result.push(found);
                    }
                }

                return result;
            }

            return null;
        };

        self.find = function(properties) {
            return $filter('filter')(cache, properties, true);
        };

        self.findOne = function(properties) {
            var found = self.find(properties);
            if (found.length > 0) {
                return found[0];
            }

            return null;
        };

        self.create = function(properties) {
            if (!angular.isObject(properties)) {
                properties = {};
            }

            var data = createData(self.schema, properties);

            while (!data.id) {
                var id = generateId();
                if (self.find({ id: id }).length === 0) {
                    data.id = id;
                }
            }

            cache.push(data);
            cacheIndexed[data.id] = data;

            return data;
        };

        self.delete = function(properties) {
            var count = 0;
            var found = _.map(self.find(properties), function(data) {
                return data.id;
            });
            if (found.length > 0) {
                for (var i = cache.length - 1; i >= 0; i--) {
                    var id = cache[i].id;
                    if (found.indexOf(id) > -1) {
                        cache.splice(i, 1);
                        delete cacheIndexed[id];
                        count++;
                    }
                }
            }

            return count;
        };

        self.clear();
    };

    return Service;
});
