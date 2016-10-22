'use strict';

describe('Filter: ignore', function () {

  // load the filter's module
  beforeEach(module('rbtvstatsApp'));

  // initialize a new instance of the filter before each test
  var ignore;
  beforeEach(inject(function ($filter) {
    ignore = $filter('ignore');
  }));

  it('should return the input prefixed with "ignore filter:"', function () {
    var text = 'angularjs';
    expect(ignore(text)).toBe('ignore filter: ' + text);
  });

});
