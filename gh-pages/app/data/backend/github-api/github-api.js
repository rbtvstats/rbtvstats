angular.module('app.data').factory('GithubApiSrv', function($http, ConfigSrv) {
    var baseUrl = 'https://api.github.com/';
    var service = {};

    function token() {
        return ConfigSrv.get('githubApiOAuthToken');
    }

    function repository() {
        return ConfigSrv.get('githubRepository');
    }

    service.getRefs = function(branch) {
        return $http({
                method: 'GET',
                url: baseUrl + 'repos/' + repository() + '/git/refs/heads/' + branch,
                headers: {
                    Authorization: 'token ' + token()
                }
            })
            .then(function(response) {
                return response.data;
            });
    };

    service.updateRefs = function(branch, commitSHA, force) {
        return $http({
                method: 'PATCH',
                url: baseUrl + 'repos/' + repository() + '/git/refs/heads/' + branch,
                headers: {
                    Authorization: 'token ' + token()
                },
                data: {
                    sha: commitSHA,
                    force: force
                }
            })
            .then(function(response) {
                return response.data;
            });
    };

    service.getTree = function(treeSHA) {
        return $http({
                method: 'GET',
                url: baseUrl + 'repos/' + repository() + '/git/trees/' + treeSHA + '?recursive=1',
                headers: {
                    Authorization: 'token ' + token()
                }
            })
            .then(function(response) {
                return response.data;
            });
    };

    service.createTree = function(treeSHA, files) {
        return $http({
                method: 'POST',
                url: baseUrl + 'repos/' + repository() + '/git/trees',
                headers: {
                    Authorization: 'token ' + token()
                },
                data: {
                    base_tree: treeSHA,
                    tree: files
                }
            })
            .then(function(response) {
                return response.data;
            });
    };

    service.getCommit = function(commitSHA) {
        return $http({
                method: 'GET',
                url: baseUrl + 'repos/' + repository() + '/git/commits/' + commitSHA,
                headers: {
                    Authorization: 'token ' + token()
                }
            })
            .then(function(response) {
                return response.data;
            });
    };

    service.createCommit = function(parentCommitSHA, treeSHA, message) {
        return $http({
                method: 'POST',
                url: baseUrl + 'repos/' + repository() + '/git/commits',
                headers: {
                    Authorization: 'token ' + token()
                },
                data: {
                    message: message,
                    parents: [parentCommitSHA],
                    tree: treeSHA
                }
            })
            .then(function(response) {
                return response.data;
            });
    };

    return service;
});
