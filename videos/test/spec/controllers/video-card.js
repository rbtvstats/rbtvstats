'use strict';

describe('Controller: VideoCardCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvCrawlerApp'));

  var VideoCardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideoCardCtrl = $controller('VideoCardCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VideoCardCtrl.awesomeThings.length).toBe(3);
  });
});
