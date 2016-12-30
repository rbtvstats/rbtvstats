angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.videos.data', {
        url: '/data/',
        templateUrl: 'app/editor/videos/data/data.html',
        controller: function($scope, $q, $timeout, Notification, ConfigSrv, GithubApiSrv, VideosDataSrv, VideosDataBackupSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data', 'videos-data-backup'];

            $scope.init = function() {
                $scope.dataServices = VideosDataSrv.getServices();
                $scope.dataBackups = VideosDataBackupSrv.all();

                $scope.remoteMetadata = null;
                $scope.localDataHash = null;

                $scope.syncState = {
                    activeUpload: false,
                    activeDownload: false
                };

                $scope.updateRemoteMetadata();
                $scope.updateLocalHash();
                $scope.updateValidation();
            };

            $scope.forceData = function(DataSrv) {
                DataSrv.force();
                DataSrv.save();
                $scope.updateLocalHash();
                $scope.updateValidation();
            };

            $scope.clearData = function(DataSrv) {
                DataSrv.clear();
                DataSrv.save();
                $scope.updateLocalHash();
                $scope.updateValidation();
            };

            $scope.getFiles = function(dataServices) {
                var files = [];

                //minified data
                _.each(dataServices, function(DataSrv) {
                    files.push({
                        id: DataSrv.id,
                        path: DataSrv.id + '.min.json',
                        content: angular.toJson(DataSrv.all())
                    });
                });

                //metadata
                var metadata = {};
                metadata.hash = VideosDataSrv.hash();
                metadata.update = moment().unix();
                metadata.files = _(files)
                    .groupBy(function(file) {
                        return file.id;
                    })
                    .transform(function(result, value, key) {
                        result[key] = _.map(value, function(value) {
                            return value.path;
                        });
                    })
                    .value();
                metadata.size = _(files).map(function(value, key) {
                    return value.content.length;
                }).sum();
                files.push({
                    path: 'metadata.json',
                    content: angular.toJson(metadata, 1)
                });

                //pretty data
                _.each(dataServices, function(DataSrv) {
                    files.push({
                        id: DataSrv.id,
                        path: DataSrv.id + '.json',
                        content: angular.toJson(DataSrv.all(), true)
                    });
                });

                return files;
            };

            $scope.upload = function() {
                var files = $scope.getFiles($scope.dataServices);
                var videosPath = ConfigSrv.get('videosPath') || '';
                var branch = ConfigSrv.get('githubBranch');
                var message = 'update video data';
                var headCommitSHA = null;
                var headTreeSHA = null;
                var newCommitSHA = null;
                var newTreeSHA = null;

                $scope.syncState.activeUpload = true;

                return GithubApiSrv.getRefs(branch)
                    .then(function(result) {
                        headCommitSHA = result.object.sha;

                        return GithubApiSrv.getCommit(headCommitSHA);
                    })
                    .then(function(result) {
                        headTreeSHA = result.tree.sha;

                        return GithubApiSrv.getTree(headTreeSHA);
                    })
                    .then(function(result) {
                        var treeFiles = _.map(files, function(file) {
                            return {
                                path: urljoin(videosPath, file.path),
                                mode: '100644',
                                type: 'blob',
                                content: file.content
                            };
                        });

                        return GithubApiSrv.createTree(headTreeSHA, treeFiles);
                    })
                    .then(function(result) {
                        newTreeSHA = result.sha;

                        return GithubApiSrv.createCommit(headCommitSHA, newTreeSHA, message);
                    })
                    .then(function(result) {
                        newCommitSHA = result.sha;

                        return GithubApiSrv.updateRefs(branch, newCommitSHA, false);
                    })
                    .then(function(result) {
                        Notification.success('Upload erfolgreich!');
                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Upload',
                            err: err,
                            errPath: 'data.message',
                            delay: null
                        }));
                    })
                    .finally(function() {
                        $scope.syncState.activeUpload = false;
                    });
            };

            $scope.download = function() {
                $scope.syncState.activeDownload = true;

                VideosDataSrv.loadRemote()
                    .then(function() {
                        Notification.success('Download erfolgreich!');
                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Download',
                            err: err,
                            delay: null
                        }));
                    })
                    .finally(function() {
                        $scope.syncState.activeDownload = false;

                        VideosDataSrv.save();

                        $scope.updateLocalHash();
                        $scope.updateValidation();
                    });
            };

            $scope.export = function(DataSrv) {
                var filename = DataSrv.id + '.json';
                var str = angular.toJson(DataSrv.all(), 1);
                var file = new File([str], filename, { type: "text/plain;charset=utf-8" });
                saveAs(file);
            };

            $scope.import = function(DataSrv, files) {
                var promises = _.map(files, function(file) {
                    return $q(function(resolve, reject) {
                        var fileReader = new FileReader();

                        fileReader.onload = function(file) {
                            resolve(file.target.result);
                        };

                        fileReader.onerror = function(err) {
                            reject(err);
                        };

                        fileReader.readAsText(file);
                    });
                });

                $q.all(promises)
                    .then(function(results) {
                        var data = _.map(results, function(result) {
                            return angular.fromJson(result);
                        });
                        data = _.flatten(data);

                        DataSrv.load(data);

                        DataSrv.save();

                        $scope.updateLocalHash();
                        $scope.updateValidation();

                        Notification.success('Import erfolgreich!');
                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Import',
                            err: err,
                            delay: null
                        }));
                    });
            };

            $scope.exportAll = function() {
                var videosPath = ConfigSrv.get('videosPath') || '';
                var files = $scope.getFiles($scope.dataServices);
                var zip = new JSZip();

                _.each(files, function(file) {
                    zip.file(urljoin(videosPath, file.path), file.content);
                });

                var hash = VideosDataSrv.hash();
                zip.generateAsync({ type: 'blob' })
                    .then(function(blob) {
                        saveAs(blob, 'data-' + hash);
                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Export',
                            err: err,
                            delay: null
                        }));
                    });
            };

            $scope.importAll = function(file) {
                if (file) {
                    var videosPath = ConfigSrv.get('videosPath') || '';
                    var fileReader = new FileReader();

                    fileReader.onload = function(file) {
                        var data = file.target.result;
                        var zip = new JSZip();
                        zip.loadAsync(data)
                            //load metadata.json
                            .then(function(zip) {
                                var filepath = urljoin(videosPath, 'metadata.json');
                                var metadataFile = zip.files[filepath];
                                if (!metadataFile) {
                                    throw 'Datei `' + filepath + '` konnte nicht entpackt werden';
                                }

                                return metadataFile.async('string');
                            })
                            //load all files for the relevant data services
                            .then(function(metadata) {
                                metadata = angular.fromJson(metadata);

                                var allPromises = [];
                                var allFiles = metadata.files;
                                _.each($scope.dataServices, function(DataSrv) {
                                    //load all files from zip for this service
                                    var files = allFiles[DataSrv.id];
                                    var promises = _.map(files, function(file) {
                                        var filepath = urljoin(videosPath, file);
                                        var zipFile = zip.files[filepath];
                                        if (!zipFile) {
                                            throw 'Datei `' + filepath + '` konnte nicht entpackt werden';
                                        }

                                        return zipFile.async('string');
                                    });

                                    //wait till all files are loaded from zip for this service
                                    var promise = $q.all(promises)
                                        .then(function(results) {
                                            results = _.map(results, function(result) {
                                                return angular.fromJson(result);
                                            });

                                            var data = _.flatten(results);
                                            DataSrv.load(data);
                                            DataSrv.save();
                                        });

                                    allPromises.push(promise);
                                });

                                return $q.all(allPromises);
                            })
                            .then(function() {
                                $scope.updateLocalHash();
                                $scope.updateValidation();

                                Notification.success('Import erfolgreich!');
                            })
                            .catch(function(err) {
                                Notification.error(Notification.parseError({
                                    title: 'Fehler beim Import',
                                    err: err,
                                    delay: null
                                }));
                            });
                    };

                    fileReader.onerror = function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Import',
                            err: err,
                            delay: null
                        }));
                    };

                    fileReader.readAsArrayBuffer(file);
                }
            };

            $scope.updateRemoteMetadata = function() {
                VideosDataSrv.loadRemoteMetadata()
                    .then(function(metadata) {
                        $scope.remoteMetadata = metadata;
                    })
                    .catch(function(err) {
                        Notification.error(Notification.parseError({
                            title: 'Fehler beim Abrufen der Metadaten',
                            err: err,
                            delay: null
                        }));
                    });
            };

            $scope.updateLocalHash = function() {
                $timeout(function() {
                    $scope.localDataHash = VideosDataSrv.hash();
                }, 300);
            };

            $scope.updateValidation = function() {
                $timeout(function() {
                    $scope.dataValid = {};
                    _.each($scope.dataServices, function(DataSrv) {
                        $scope.dataValid[DataSrv.id] = DataSrv.isValid();
                    });
                }, 300);
            };

            $scope.createBackup = function() {
                VideosDataBackupSrv.create();
                VideosDataBackupSrv.save();
            };

            $scope.restoreBackup = function(backup) {
                VideosDataBackupSrv.restore(backup);

                VideosDataSrv.save();

                $scope.updateLocalHash();
                $scope.updateValidation();
            };

            $scope.deleteBackup = function(backup) {
                VideosDataBackupSrv.delete(backup);
                VideosDataBackupSrv.save();
            };
        }
    });
});
