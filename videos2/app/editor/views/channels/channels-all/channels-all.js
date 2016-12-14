angular.module('app.editor').config(function($stateProvider) {
    $stateProvider.state('editor.channels.all', {
        url: '/',
        templateUrl: 'app/editor/views/channels/channels-all/channels-all.html',
        controller: function($scope, $state, NgTableParams, InitSrv, StateSrv, ChannelsSrv) {
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
                $scope.exec = {
                    code: 'console.log(channel);'
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

                StateSrv.watch($scope, ['tableOptions', 'exec']);
            };

            $scope.one = function(channel) {
                $state.go('editor.channels.one', { channelId: channel.id });
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

            $scope.run = function(exec) {
                var code = '';
                code += '_.each($scope.channels, function(channel) {';
                code += exec.code || '';
                code += '});';

                eval(code);
            };

            $scope.update = function() {
                $scope.tableParams.reload();
            };

            InitSrv.init($scope, $scope.init, 50);
        }
    });
});
