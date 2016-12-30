angular.module('app.safety.multipleCheck')
    .controller('multipleCheckItemDetailRandomInfoController',[
        '$scope','$state','$ionicPopup','multipleCheckItemDetailRandomInfoService', '$stateParams',
        '$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemDetailRandomInfoService,$stateParams,
                  $ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.id != null){
                    multipleCheckItemDetailRandomInfoService.queryInfoData($stateParams.id,function(){
                        $scope.info = multipleCheckItemDetailRandomInfoService.getServiceData() || [];
                    });
                }
            });

            $scope.back = function () {
                multipleCheckItemDetailRandomInfoService.clearCachedData();
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
