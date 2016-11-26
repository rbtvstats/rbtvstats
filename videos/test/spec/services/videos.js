'use strict';

describe('Service: videos', function () {

  // load the service's module
  beforeEach(module('rbtvCrawlerApp'));

  // instantiate service
  var videos;
  beforeEach(inject(function (_videos_) {
    videos = _videos_;
  }));

  it('should do something', function () {
    expect(!!videos).toBe(true);
  });

});
