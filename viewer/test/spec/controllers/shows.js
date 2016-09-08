'use strict';

describe('Controller: ShowsCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvstatsApp'));

  var ShowsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShowsCtrl = $controller('ShowsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ShowsCtrl.awesomeThings.length).toBe(3);
  });
});
