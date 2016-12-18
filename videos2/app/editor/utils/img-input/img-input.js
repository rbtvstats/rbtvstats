angular.module('app.editor').directive('imgInput', function() {
    return {
        restrict: 'A',
        scope: {
            image: '=imgInput'
        },
        templateUrl: 'app/editor/utils/img-input/img-input.html',
        controller: function($scope, $q) {
            function urlToBase64(url) {
                return $q(function(resolve, reject) {
                    var canvas = $('#imageCanvas');

                    if (canvas.length > 0) {
                        canvas = canvas[0];
                        var context = canvas.getContext('2d');
                        var img = new Image();
                        img.setAttribute('crossOrigin', 'anonymous');
                        img.src = url;
                        img.onload = function() {
                            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                            var base64Img = canvas.toDataURL('image/jpeg');

                            resolve(base64Img);
                        };
                        img.onerror = function() {
                            reject();
                        };
                    } else {
                        reject();
                    }
                });
            }

            function fileToBase64(file) {
                return $q(function(resolve, reject) {
                    var canvas = $('#imageCanvas');

                    if (canvas.length > 0) {
                        canvas = canvas[0];
                        var context = canvas.getContext('2d');
                        var URL = window.URL || window.webkitURL;
                        var src = URL.createObjectURL(file);
                        var img = new Image();

                        img.src = src;

                        img.onload = function() {
                            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                            var base64Img = canvas.toDataURL('image/jpeg');

                            resolve(base64Img);
                        };

                        img.onerror = function(e) {
                            reject();
                        };
                    } else {
                        reject();
                    }
                });
            }

            $scope.convertImageUrl = function(url) {
                if (angular.isString(url)) {
                    url = url.trim();
                    if (url.indexOf('http') === 0) {
                        urlToBase64(url)
                            .then(function(base64) {
                                $scope.image = base64;
                            })
                            .catch(function(err) {
                                //TODO
                            });
                    }
                }
            };

            $scope.changedImageSelection = function(file) {
                fileToBase64(file)
                    .then(function(base64) {
                        $scope.image = base64;
                    })
                    .catch(function(err) {
                        //TODO
                    });
            };
        }
    };
});
