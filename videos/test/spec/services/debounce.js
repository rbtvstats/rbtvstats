'use strict';

describe('Service: debounce', function () {

  // load the service's module
  beforeEach(module('rbtvCrawlerApp'));

  // instantiate service
  var debounce;
  beforeEach(inject(function (_debounce_) {
    debounce = _debounce_;
  }));

  it('should do something', function () {
    expect(!!debounce).toBe(true);
  });

});
