'use strict';

describe('Controller: NavigationCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvCrawlerApp'));

  var NavigationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NavigationCtrl = $controller('NavigationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NavigationCtrl.awesomeThings.length).toBe(3);
  });
});
