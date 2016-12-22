angular.module('app.viewer').config(function($stateProvider) {
    $stateProvider.state('viewer.videos.hosts.all', {
        url: '/',
        templateUrl: 'app/viewer/videos/hosts/hosts-all/hosts-all.html',
        controller: function($scope, $state, NgTableParams, StateSrv, HostsSrv) {
            $scope.initDelay = 50;
            $scope.initDependencies = ['videos-data'];

            $scope.init = function() {
                $scope.hosts = HostsSrv.all();
                $scope.table = {
                    header: {
                        title: 'Moderatoren'
                    },
                    params: new NgTableParams({}, {
                        dataset: $scope.hosts
                    }),
                    options: {
                        display: {
                            view: 'list',
                            count: 10
                        },
                        order: {
                            column: 'firstname',
                            type: 'asc'
                        },
                        filter: ''
                    },
                    views: [{
                        id: 'list',
                        name: 'Liste',
                        icon: 'fa-th-list',
                        template: 'app/viewer/videos/hosts/hosts-all/hosts-all-list.html'
                    }, {
                        id: 'card',
                        name: 'Kacheln',
                        icon: 'fa-th-large',
                        template: 'app/viewer/videos/hosts/hosts-all/hosts-all-card.html'
                    }]
                };
            };

            var domainIcons = {
                'rocketbeans.tv': 'icon icon-bohne',
                'bohnenwiki.de': 'icon icon-bohne',
                'twitter.com': 'fa fa-colored fa-twitter',
                'reddit.com': 'fa fa-colored fa-reddit',
                'twitch.tv': 'fa fa-colored fa-twitch',
                'youtube.com': 'fa fa-colored fa-youtube'
            };

            $scope.getDomainIcon = function(link) {
                var domain = url('domain', link);
                var icon = domainIcons[domain];
                if (!icon) {
                    icon = 'fa fa-colored fa-external-link';
                }

                return icon;
            };

            $scope.one = function(host) {
                $state.transitionTo('viewer.videos.hosts.one', { hostId: host.id });
            };

            $scope.update = function() {
                $scope.table.params.reload();
            };
        }
    });
});
