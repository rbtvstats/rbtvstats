'use strict';

/**
 * @ngdoc directive
 * @name rbtvCrawlerApp.directive:jsonEditor
 * @description
 * # jsonEditor
 */
app.directive('jsonEditor', function() {
    return {
        templateUrl: 'views/template-json-editor.html',
        restrict: 'A',
        scope: {
            data: '=jsonEditor',
            editorOnly: '='
        },
        controller: 'JsonEditorCtrl'
    };
});
