'use strict';

describe('Service: channels', function () {

  // load the service's module
  beforeEach(module('rbtvCrawlerApp'));

  // instantiate service
  var channels;
  beforeEach(inject(function (_channels_) {
    channels = _channels_;
  }));

  it('should do something', function () {
    expect(!!channels).toBe(true);
  });

});
