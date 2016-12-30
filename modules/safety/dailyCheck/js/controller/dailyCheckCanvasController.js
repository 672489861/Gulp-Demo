angular.module('app.safety.dailyCheck')
    .controller('dailyCheckCanvasController', ['$scope', '$state', '$stateParams', '$ionicViewSwitcher','$ionicPopup','dailyCheckAddService','YTService','UserService','env',
        function ($scope, $state, $stateParams, $ionicViewSwitcher,$ionicPopup,dailyCheckAddService,YTService,userService,env) {
            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.index != null){
                    $scope.index = $stateParams.index;
                }
                if($stateParams.image){
                    $scope.image = $stateParams.image;
                    $scope.drawing = new Drawing({
                        id: 'canvas',
                        src: $scope.image.src,
                        fullScreen: true
                    });

                }
            });
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };

            $scope.save = function(){
                $ionicPopup.confirm({
                    title: '提示',
                    template: '<p class="text-center">您确定要保存编辑的图片？</p>',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    if(res){
                        $scope.data = $scope.drawing.getImage();
                        var imgList = dailyCheckAddService.getImagList();
                        YTService.uploadBase64Attach($scope.data,function(item){
                            var ticket = userService.getTicket();
                            item.src = item.data.url.replace("\\", "/");
                            item.src = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + item.src;
                            imgList[$scope.index] = item;
                            dailyCheckAddService.setImagList(imgList);
                            $ionicPopup.alert({
                                title: '提示',
                                template: '<p class="text-center">保存成功!</p>'
                            }).then(function(){
                                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                                $ionicViewSwitcher.nextDirection("back");
                            });
                        });

                    }
                });
            }

        }]);