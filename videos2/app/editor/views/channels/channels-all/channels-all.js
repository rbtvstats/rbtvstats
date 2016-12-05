angular.module('app.editor').controller('ChannelsAllCtrl', function($scope, $timeout, $state, NgTableParams, StateSrv, ChannelsSrv) {
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
        $scope.tableOptions = {
            display: {
                view: 'list',
                count: 25
            }
        };

        //view
        $scope.displayViewOptions = [
            { value: 'list', name: 'Liste', icon: 'fa-th-list' },
            { value: 'card', name: 'Kacheln', icon: 'fa-th-large' }
        ];
        $scope.displayCountOptions = [10, 25, 50];

        $scope.$watchCollection('tableOptions.display', function(newVal, oldVal) {
            $scope.tableParams.count($scope.tableOptions.display.count);
        });

        StateSrv.watch($scope, ['tableOptions']);

        $scope.initialized = true;
    };

    $scope.one = function(channel) {
        $state.transitionTo('editor.channels.one', { channelId: channel.id });
    };

    $scope.add = function() {
        var channel = ChannelsSrv.create();
        ChannelsSrv.save();
        $scope.one(channel);
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
