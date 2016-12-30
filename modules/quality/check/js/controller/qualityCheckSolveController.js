angular.module('app.quality.check')
    .controller('qualityCheckSolveController', ['$scope', '$state', '$stateParams', 'qualityCheckService',
        '$ionicPopup','$ionicViewSwitcher','UserService','env','$ionicActionSheet',
        function ($scope, $state, $stateParams, qualityCheckService,
                  $ionicPopup,$ionicViewSwitcher,userService,env,$ionicActionSheet) {
            $scope.$on('$ionicView.beforeEnter', function () {
                qualityCheckService.queryDetail($stateParams.id,function (data) {
                    $scope.detailInfo = data;
                });
                qualityCheckService.queryDetailProblem($stateParams.id, function () {
                    $scope.contentList = qualityCheckService.getContent();
                });
                qualityCheckService.queryDetailCheckAttach($stateParams.id, function (data) {
                    $scope.checkAttach =data;
                    $scope.changeAttach($scope.checkAttach);
                });
                qualityCheckService.queryDetailRecheckAttach($stateParams.id, function (data) {
                    $scope.recheckAttach = [];
                    if(data.length > 0){
                        $scope.recheckAttach = data;
                        $scope.changeAttach($scope.recheckAttach);
                    }
                });
                $scope.backUrl = $stateParams.backUrl || "quality/check/quality-list";
            });

            $scope.solve = function(data){
                qualityCheckService.solveAndRecheckData(data,16001003,'复查',function(){
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