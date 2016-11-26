'use strict';

describe('Filter: createDate', function () {

  // load the filter's module
  beforeEach(module('rbtvCrawlerApp'));

  // initialize a new instance of the filter before each test
  var createDate;
  beforeEach(inject(function ($filter) {
    createDate = $filter('createDate');
  }));

  it('should return the input prefixed with "createDate filter:"', function () {
    var text = 'angularjs';
    expect(createDate(text)).toBe('createDate filter: ' + text);
  });

});
