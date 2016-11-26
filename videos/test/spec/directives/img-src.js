'use strict';

describe('Directive: imgSrc', function () {

  // load the directive's module
  beforeEach(module('rbtvCrawlerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<img-src></img-src>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the imgSrc directive');
  }));
});
