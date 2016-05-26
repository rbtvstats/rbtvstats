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

    service.save = function(id, model) {
    	$rootScope.state = $rootScope.state || {};
        $rootScope.state[id] = model;
    };

    service.load = function(id, defaultModel) {
    	$rootScope.state = $rootScope.state || {};
        return $rootScope.state[id] || defaultModel;
    };

    return service;
});
