angular.module('app.safety.multipleCheck')
    .controller('multipleCheckAdviceTextController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService',
        '$stateParams','$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,
                  $stateParams,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                $scope.detail = multipleCheckItemAddService.getDetailData() || {};
            });

            $scope.submit = function(){
                multipleCheckItemAddService.setAdvice({advice:$scope.detail.advice});
                $scope.back();
            };

            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
