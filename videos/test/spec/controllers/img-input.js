'use strict';

describe('Controller: ImgInputCtrl', function () {

  // load the controller's module
  beforeEach(module('rbtvCrawlerApp'));

  var ImgInputCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImgInputCtrl = $controller('ImgInputCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ImgInputCtrl.awesomeThings.length).toBe(3);
  });
});
