'use strict';

describe('Service: hosts', function () {

  // load the service's module
  beforeEach(module('rbtvCrawlerApp'));

  // instantiate service
  var hosts;
  beforeEach(inject(function (_hosts_) {
    hosts = _hosts_;
  }));

  it('should do something', function () {
    expect(!!hosts).toBe(true);
  });

});
