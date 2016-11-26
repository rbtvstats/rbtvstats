'use strict';

describe('Service: videosData', function () {

  // load the service's module
  beforeEach(module('rbtvCrawlerApp'));

  // instantiate service
  var videosData;
  beforeEach(inject(function (_videosData_) {
    videosData = _videosData_;
  }));

  it('should do something', function () {
    expect(!!videosData).toBe(true);
  });

});
