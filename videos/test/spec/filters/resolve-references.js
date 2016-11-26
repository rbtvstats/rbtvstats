'use strict';

describe('Filter: resolveReferences', function () {

  // load the filter's module
  beforeEach(module('rbtvCrawlerApp'));

  // initialize a new instance of the filter before each test
  var resolveReferences;
  beforeEach(inject(function ($filter) {
    resolveReferences = $filter('resolveReferences');
  }));

  it('should return the input prefixed with "resolveReferences filter:"', function () {
    var text = 'angularjs';
    expect(resolveReferences(text)).toBe('resolveReferences filter: ' + text);
  });

});
