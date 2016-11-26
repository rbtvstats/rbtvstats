'use strict';

/**
 * @ngdoc filter
 * @name rbtvCrawlerApp.filter:resolveReferences
 * @function
 * @description
 * # resolveReferences
 * Filter in the rbtvCrawlerApp.
 */
app.filter('resolveReferences', function(DataControllerSrv) {
    return function(input, id) {
        var dataService = DataControllerSrv.get(id);
        if (dataService) {
            return dataService.findById(input);
        }

        return input;
    };
});
