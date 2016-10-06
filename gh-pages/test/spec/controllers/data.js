'use strict';

describe('Controller: DataCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvstatsApp'));

  var DataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataCtrl = $controller('DataCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DataCtrl.awesomeThings.length).toBe(3);
  });
});
