'use strict';

describe('Controller: ConfigCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvCrawlerApp'));

  var ConfigCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigCtrl = $controller('ConfigCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigCtrl.awesomeThings.length).toBe(3);
  });
});
