angular.module('app.editor').controller('ChannelsAllCtrl', function($scope, $timeout, $state, NgTableParams, ChannelsSrv) {
    $scope.init = function() {
        $scope.channels = ChannelsSrv.all();
        $scope.tableParams = new NgTableParams({
            sorting: {
                title: 'asc'
            },
            count: 25
        }, {
            dataset: $scope.channels,
            counts: []
        });

        $scope.initialized = true;
    };

    $scope.details = function(channel) {
        $state.transitionTo('editor.channels.one', { channelId: channel.id });
    };

    $scope.add = function() {
        var channel = ChannelsSrv.create();
        ChannelsSrv.save();
        $scope.details(channel);
    };

    $scope.delete = function(channel) {
        ChannelsSrv.delete({ id: channel.id });
        ChannelsSrv.save();
        $scope.update();
    };

    $scope.update = function() {
        $scope.tableParams.reload();
    };

    $timeout($scope.init, 50);
});
angular.module('app.editor').directive('includeReplace', function() {
    return {
        require: 'ngInclude',
        restrict: 'A',
        /* optional */
        link: function(scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});
