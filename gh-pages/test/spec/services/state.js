'use strict';

describe('Service: state', function () {

  // load the service's module
  beforeEach(module('rbtvstatsApp'));

  // instantiate service
  var state;
  beforeEach(inject(function (_state_) {
    state = _state_;
  }));

  it('should do something', function () {
    expect(!!state).toBe(true);
  });

});
