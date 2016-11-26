'use strict';

describe('Directive: select', function () {

  // load the directive's module
  beforeEach(module('rbtvCrawlerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<select></select>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the select directive');
  }));
});
