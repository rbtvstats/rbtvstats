'use strict';

describe('Filter: noHost', function () {

  // load the filter's module
  beforeEach(module('rbtvstatsApp'));

  // initialize a new instance of the filter before each test
  var noHost;
  beforeEach(inject(function ($filter) {
    noHost = $filter('noHost');
  }));

  it('should return the input prefixed with "noHost filter:"', function () {
    var text = 'angularjs';
    expect(noHost(text)).toBe('noHost filter: ' + text);
  });

});
