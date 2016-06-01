'use strict';

describe('Directive: videos', function () {

  // load the directive's module
  beforeEach(module('rbtvstatsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<videos></videos>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the videos directive');
  }));
});
