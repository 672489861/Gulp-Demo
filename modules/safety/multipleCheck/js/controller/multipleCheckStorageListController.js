angular.module('app.safety.multipleCheck')
    .controller('multipleCheckStorageListController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService', '$ionicHistory','$stateParams','$ionicViewSwitcher','LocalStorageService',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,$ionicHistory,$stateParams,$ionicViewSwitcher,LocalStorageService) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.projectId != null){
                    $scope.projectId = $stateParams.projectId;
                }
                $scope.localDataList = multipleCheckItemAddService.getStorageList($scope.projectId) || [];
            });


            $scope.toEdit= function(id,backUrl){
                $state.go('safety/multipleCheck/multipleCheck-storage-edit',{id:id,backUrl:backUrl});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.back = function () {
                multipleCheckItemAddService.clearCachedData();
                $state.go($scope.backUrl,{projectId:$scope.projectId,backUrl:'safety/multipleCheck/multipleCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
