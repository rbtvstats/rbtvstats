describe('videosResolve', function() {

    beforeEach(module('app.data.videos'));

    it('should ...', inject(function($filter) {

        var filter = $filter('videosResolve');

        expect(filter('input')).toEqual('output');

    }));

});
