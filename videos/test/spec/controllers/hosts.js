'use strict';

describe('Controller: HostsCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvCrawlerApp'));

  var HostsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HostsCtrl = $controller('HostsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HostsCtrl.awesomeThings.length).toBe(3);
  });
});
