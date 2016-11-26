'use strict';

describe('Service: dataController', function () {

  // load the service's module
  beforeEach(module('rbtvCrawlerApp'));

  // instantiate service
  var dataController;
  beforeEach(inject(function (_dataController_) {
    dataController = _dataController_;
  }));

  it('should do something', function () {
    expect(!!dataController).toBe(true);
  });

});
