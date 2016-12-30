angular.module('app.safety.dailyCheck')
    .controller('dailyCheckDetailController', ['$scope', '$state', '$stateParams', 'dailyCheckService', '$ionicViewSwitcher','UserService','env','$ionicActionSheet',
        function ($scope, $state, $stateParams, dailyCheckService,$ionicViewSwitcher,userService,env,$ionicActionSheet) {
            $scope.$on('$ionicView.loaded', function () {
                dailyCheckService.queryDetail($stateParams.id,function (data) {
                    $scope.detailInfo = data;
                });
                dailyCheckService.queryDetailProblem($stateParams.id, function (data) {
                    $scope.contentList = dailyCheckService.getContent();
                });
                dailyCheckService.queryDetailCheckAttach($stateParams.id, function (data) {
                    $scope.checkAttach = data;
                    $scope.changeAttach($scope.checkAttach);
                });
                dailyCheckService.queryDetailRecheckAttach($stateParams.id, function (data) {
                    $scope.recheckAttach = data;
                    $scope.changeAttach($scope.recheckAttach);
                });
                $scope.backUrl = $stateParams.backUrl || "safety/dailyCheck/dailyCheck-list";
            });
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