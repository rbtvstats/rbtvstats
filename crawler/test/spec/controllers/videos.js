'use strict';

describe('Controller: VideosCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvstatsApp'));

  var VideosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideosCtrl = $controller('VideosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VideosCtrl.awesomeThings.length).toBe(3);
  });
});
