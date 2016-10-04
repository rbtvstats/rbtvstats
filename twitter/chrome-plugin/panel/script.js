var app = angular.module('app', []);

app.controller('app', function($scope, $http) {
    $scope.sendData = function(data, callback) {
        $http.post('http://127.0.0.1:8042', data);
    };

    $scope.startRequestListener = function() {
        chrome.devtools.network.onRequestFinished.addListener(function(data) {
            var request = data.request;
            var filterUrl = 'https://api.twitter.com/1.1/search/universal.json';
            if (request.url.startsWith(filterUrl)) {
                data.getContent(function(body) {
                    content = JSON.parse(body);
                    if (typeof(content) === 'object') {
                        var modules = content.modules;
                        if (typeof(modules) === 'object') {
                            var tweets = {};
                            for (var i = 0; i < modules.length; i++) {
                                try {
                                    var module = modules[i];
                                    var data = module.status.data;
                                    var user = data.user;
                                    var id = data.id_str;
                                    var tweet = {
                                        text: data.full_text,
                                        created_at: data.created_at,
                                        favorite_count: data.favorite_count || 0,
                                        retweet_count: data.retweet_count || 0,
                                        user: {
                                            id: user.id_str,
                                            name: user.screen_name
                                        }
                                    };
                                    tweets[id] = tweet;
                                } catch (err) {

                                }
                            }

                            $scope.sendData(tweets);
                        }
                    }
                });
            }
        });
    };

    $scope.startRequestListener();
});
