'use strict';

/**
 * @ngdoc service
 * @name rbtvstatsApp.state
 * @description
 * # state
 * Service in the rbtvstatsApp.
 */
app.service('StateSrv', function($rootScope) {
    var service = {};

    service.save = function(path, model) {
        var splitPath = path.split('/');
    	$rootScope.state = $rootScope.state || {};
        $rootScope.state[splitPath[1]] = model;
    };

    service.load = function(path, defaultModel) {
        var splitPath = path.split('/');
    	$rootScope.state = $rootScope.state || {};
        return $rootScope.state[splitPath[1]] || defaultModel;
    };

    return service;
});
