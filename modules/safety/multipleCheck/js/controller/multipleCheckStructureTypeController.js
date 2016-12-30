angular.module('app.safety.multipleCheck')
    .controller('multipleCheckStructureTypeController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService',
        '$stateParams','$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,
                  $stateParams,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.preBackUrl){
                    $scope.preBackUrl = $stateParams.preBackUrl;
                }
                $scope.detail = multipleCheckItemAddService.getDetailData() || {};
                $scope.structureTypeList = multipleCheckItemAddService.getStructureType() || [];
            });

            $scope.chooseStructureType = function(item){
                multipleCheckItemAddService.setStructureType({structureTypeId:item.id,structureName:item.name});
                $scope.back();
            };

            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:$scope.preBackUrl});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
