angular.module('app.safety.multipleCheck')
    .controller('multipleCheckItemListController',[
        '$scope','$state','$ionicPopup','multipleCheckItemListService', '$ionicHistory','$stateParams','$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemListService,$ionicHistory,$stateParams,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.editId){
                    $scope.editId = $stateParams.editId;
                    multipleCheckItemListService.setEditId($scope.editId);
                }
                if($stateParams.projectId != null){
                    $scope.projectId = $stateParams.projectId;
                    multipleCheckItemListService.setProjectId($scope.projectId);
                }
                $scope.editId = multipleCheckItemListService.getEditId();
                $scope.projectId = multipleCheckItemListService.getProjectId();
                $scope.refreshListData($scope.projectId,$scope.editId);
                var localDataList = multipleCheckItemListService.getStorageList($scope.projectId) || [];
                $scope.localDataLength = localDataList.length;
            });

            $scope.loadListData = function () {
                multipleCheckItemListService.loadListData($scope.projectId,function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.itemList = multipleCheckItemListService.getServiceData();
                $scope.hasNextPage = multipleCheckItemListService.hasNextPage();
                $scope.right = multipleCheckItemListService.getRight();
            };

            $scope.refreshListData = function () {
                multipleCheckItemListService.refreshListData($scope.projectId,function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.toItemDetail= function(id,statusId,backUrl){
                multipleCheckItemListService.clearCachedData();
                if(statusId == 0){
                    $state.go('safety/multipleCheck/multipleCheck-item-edit',{id:id,backUrl:backUrl});
                    $ionicViewSwitcher.nextDirection("forward");
                }else if(statusId == 1){
                    $state.go('safety/multipleCheck/multipleCheck-item-detail',{id:id,backUrl:backUrl});
                    $ionicViewSwitcher.nextDirection("forward");
                }
            };

            $scope.toAdd= function(backUrl){
                multipleCheckItemListService.clearCachedData();
                $state.go('safety/multipleCheck/multipleCheck-item-add',{projectId:$scope.projectId,backUrl:backUrl,editId:multipleCheckItemListService.getEditId()});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.toStorage= function(backUrl){
                multipleCheckItemListService.clearCachedData();
                $state.go('safety/multipleCheck/multipleCheck-storage-list',{projectId:$scope.projectId,backUrl:backUrl});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.back = function () {
                multipleCheckItemListService.clearCachedData();
                $state.go($scope.backUrl);
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
