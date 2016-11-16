'use strict';

describe('Filter: imageName', function () {

  // load the filter's module
  beforeEach(module('rbtvstatsApp'));

  // initialize a new instance of the filter before each test
  var imageName;
  beforeEach(inject(function ($filter) {
    imageName = $filter('imageName');
  }));

  it('should return the input prefixed with "imageName filter:"', function () {
    var text = 'angularjs';
    expect(imageName(text)).toBe('imageName filter: ' + text);
  });

});
