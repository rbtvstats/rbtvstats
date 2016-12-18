angular.module('app.viewer').controller('FooterCtrl', function($scope) {
    $scope.rbtvLinks = [{
        title: 'Rocketbeans',
        url: 'https://www.rocketbeans.tv/',
        icon: 'fa-home'
    }, {
        title: 'Youtube',
        url: 'https://www.youtube.com/channel/UCQvTDmHza8erxZqDkjQ4bQQ',
        icon: 'fa-youtube-play'
    }];

    $scope.ownLinks = [{
        title: 'Github',
        url: 'https://github.com/rbtvstats',
        icon: 'fa-github'
    }];
});
