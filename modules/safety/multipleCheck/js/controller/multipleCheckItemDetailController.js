angular.module('app.safety.multipleCheck')
    .controller('multipleCheckItemDetailController',[
        '$scope','$state','$ionicPopup','multipleCheckItemDetailService', '$stateParams','$ionicViewSwitcher','$ionicActionSheet',
        function ($scope,$state, $ionicPopup,multipleCheckItemDetailService,$stateParams,$ionicViewSwitcher,$ionicActionSheet) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.id != null){
                    multipleCheckItemDetailService.queryDetailData($stateParams.id,function(){
                        $scope.detail = multipleCheckItemDetailService.getDetailData() || {};
                    });
                    multipleCheckItemDetailService.queryDetailGroupData($stateParams.id,function(){
                        $scope.groupList = multipleCheckItemDetailService.getGroupDataList() || [];
                    });
                }else{
                    $scope.detail = multipleCheckItemDetailService.getDetailData() || {};
                    $scope.groupList = multipleCheckItemDetailService.getGroupDataList() || [];
                }
            });

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

            $scope.toProjectStatus = function(){
                $state.go('safety/multipleCheck/multipleCheck-detail-project-status',{backUrl:'safety/multipleCheck/multipleCheck-item-detail'});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.toAdviceText = function(){
                $state.go('safety/multipleCheck/multipleCheck-detail-advice-text',{backUrl:'safety/multipleCheck/multipleCheck-item-detail'});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.toRandomInfo= function(id,backUrl){
                $state.go('safety/multipleCheck/multipleCheck-item-detail-random-info',{id:id,backUrl:backUrl});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.back = function () {
                multipleCheckItemDetailService.clearCachedData();
                $state.go($scope.backUrl,{projectId:$scope.detail.projectId,backUrl:'safety/multipleCheck/multipleCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
