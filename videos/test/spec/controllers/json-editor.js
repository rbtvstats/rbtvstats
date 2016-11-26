'use strict';

describe('Controller: JsonEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvCrawlerApp'));

  var JsonEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JsonEditorCtrl = $controller('JsonEditorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(JsonEditorCtrl.awesomeThings.length).toBe(3);
  });
});
