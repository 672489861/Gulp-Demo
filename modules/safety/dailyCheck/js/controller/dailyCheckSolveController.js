angular.module('app.safety.dailyCheck')
    .controller('dailyCheckSolveController', ['$scope', '$state', '$stateParams', 'dailyCheckService',
        '$ionicPopup','$ionicViewSwitcher','UserService','env','$ionicActionSheet',
        function ($scope, $state, $stateParams, dailyCheckService,
                  $ionicPopup,$ionicViewSwitcher,userService,env,$ionicActionSheet) {
            $scope.$on('$ionicView.beforeEnter', function () {
                dailyCheckService.queryDetail($stateParams.id,function (data) {
                    $scope.detailInfo = data;
                });
                dailyCheckService.queryDetailProblem($stateParams.id, function () {
                    $scope.contentList = dailyCheckService.getContent();
                });
                dailyCheckService.queryDetailCheckAttach($stateParams.id, function (data) {
                    $scope.checkAttach =data;
                    $scope.changeAttach($scope.checkAttach);
                });
                dailyCheckService.queryDetailRecheckAttach($stateParams.id, function (data) {
                    $scope.recheckAttach = [];
                    if(data.length > 0){
                        $scope.recheckAttach = data;
                        $scope.changeAttach($scope.recheckAttach);
                    }
                });
                $scope.backUrl = $stateParams.backUrl || "safety/dailyCheck/dailyCheck-list";
            });

            $scope.solve = function(data){
                dailyCheckService.solveAndRecheckData(data,15001003,'复查',function(){
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">处理成功!</p>'
                    }).then(function(){
                        $state.go($scope.backUrl);
                        $ionicViewSwitcher.nextDirection("back");
                    });
                })
            };

            $scope.back=function(){
                $state.go($scope.backUrl);
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.changeAttach = function(list){
                if(list.length > 0 ){
                    for(var i=0;i<list.length;i++){
                        var ticket = userService.getTicket();
                        list[i].src = list[i].url.replace("\\", "/");
                        list[i].src = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + list[i].src;
                    }
                }
            };
            $scope.preview= function (imgIndex, arr) {
                $ionicActionSheet.show({
                    buttons: [
                        {text: '预览'}
                    ],
                    cancelText: '关闭',
                    cancel: function () {
                        return true;
                    },
                    buttonClicked: function () {
                        PhotoViewer.show(arr[imgIndex].src);
                        return true;
                    }
                });
            };
        }]);