'use strict';

describe('Controller: SchemasCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvCrawlerApp'));

  var SchemasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SchemasCtrl = $controller('SchemasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SchemasCtrl.awesomeThings.length).toBe(3);
  });
});
