'use strict';

describe('Service: shows', function () {

  // load the service's module
  beforeEach(module('rbtvCrawlerApp'));

  // instantiate service
  var shows;
  beforeEach(inject(function (_shows_) {
    shows = _shows_;
  }));

  it('should do something', function () {
    expect(!!shows).toBe(true);
  });

});
