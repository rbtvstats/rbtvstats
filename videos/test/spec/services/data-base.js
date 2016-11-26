'use strict';

describe('Service: dataBase', function () {

  // load the service's module
  beforeEach(module('rbtvCrawlerApp'));

  // instantiate service
  var dataBase;
  beforeEach(inject(function (_dataBase_) {
    dataBase = _dataBase_;
  }));

  it('should do something', function () {
    expect(!!dataBase).toBe(true);
  });

});
