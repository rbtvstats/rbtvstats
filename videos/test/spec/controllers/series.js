'use strict';

describe('Controller: SeriesCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvCrawlerApp'));

  var SeriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeriesCtrl = $controller('SeriesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SeriesCtrl.awesomeThings.length).toBe(3);
  });
});
