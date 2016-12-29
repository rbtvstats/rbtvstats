angular.module('app.viewer').controller('FooterCtrl', function($scope) {
    $scope.rbtvLinks = [{
        title: 'Rocket Beans TV',
        url: 'https://rocketbeans.tv/',
        icon: 'fa-home'
    }, {
        title: 'Livestream',
        url: 'https://gaming.youtube.com/rocketbeanstv/live',
        icon: 'fa-youtube-play'
    }];

    $scope.ownLinks = [{
        title: 'Feedback',
        url: 'https://forum.rocketbeans.tv/t/rocket-beans-tv-statistiken-rbtvstats-github-io/18816',
        icon: 'fa-comment'
    }, {
        title: 'Github',
        url: 'https://github.com/rbtvstats',
        icon: 'fa-github'
    }];
});
