'use strict';

describe('Filter: noShow', function () {

  // load the filter's module
  beforeEach(module('rbtvstatsApp'));

  // initialize a new instance of the filter before each test
  var noShow;
  beforeEach(inject(function ($filter) {
    noShow = $filter('noShow');
  }));

  it('should return the input prefixed with "noShow filter:"', function () {
    var text = 'angularjs';
    expect(noShow(text)).toBe('noShow filter: ' + text);
  });

});
