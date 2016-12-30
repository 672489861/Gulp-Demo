angular.module('app.safety.multipleCheck')
    .controller('multipleCheckDetailAdviceTextController',[
        '$scope','$state','$ionicPopup','multipleCheckItemDetailService',
        '$stateParams','$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemDetailService,
                  $stateParams,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                $scope.detail = multipleCheckItemDetailService.getDetailData();
            });

            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
