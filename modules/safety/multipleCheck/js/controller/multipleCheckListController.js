angular.module('app.safety.multipleCheck')
    .controller('multipleCheckListController',[
        '$scope','$state','$ionicPopup','multipleCheckListService',
        '$ionicHistory','$ionicViewSwitcher','UserService','$ionicModal','$ionicScrollDelegate',
        function ($scope,$state, $ionicPopup,multipleCheckListService,
                  $ionicHistory,$ionicViewSwitcher,userService,$ionicModal,$ionicScrollDelegate) {

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.refreshListData();
            });

            $scope.condition = multipleCheckListService.getCondition();
            //搜索数据
            $scope.searchData = function () {
                $scope.modalQueryType.hide();
                //根据查询条件查询结果集
                multipleCheckListService.clearCachedData();
                $ionicScrollDelegate.scrollTop();
                $scope.modalQueryMore.hide();
                $scope.loadListData();

            };
            //清空查询条件
            $scope.clearSearch = function () {
                multipleCheckListService.resetCondition();
                $scope.condition = multipleCheckListService.getCondition();
            };

            $scope.isqueryType = false;
            $scope.isqueryMore = false;
            $scope.isTypeOne = false;
            $ionicModal.fromTemplateUrl('query-more.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMore = modal;
            });
            $ionicModal.fromTemplateUrl('query-type.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryType = modal;
            });
            $scope.openQueryType = function () {
                $scope.modalQueryType.show();
                $scope.isqueryType = !$scope.isqueryType;
                $scope.isqueryMore = false;
            };

            $scope.openQueryMore = function () {
                $scope.modalQueryMore.show();
                $scope.isqueryMore = !$scope.isqueryMore;
                $scope.isqueryType = false;
            };

            $scope.closeQuery = function () {
                $scope.isqueryType = false;
                $scope.isqueryMore = false;
            };
            $scope.openType = function () {
                $scope.isTypeOne = true;
            };
            $scope.closeType = function(name){
                $scope.isTypeOne = false;
                $scope.condition.statusName = name;
            };

            $scope.fillData = function () {
                $scope.hasNextPage = multipleCheckListService.hasNextPage();
                $scope.projectList = multipleCheckListService.getServiceData();
                $scope.companyList = multipleCheckListService.getCompanyList();
                $scope.typeId = userService.getTypeId();
                $scope.searchText = "";
            };

            $scope.loadListData = function () {
                multipleCheckListService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.refreshListData = function () {
                multipleCheckListService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.back = function () {
                multipleCheckListService.clearCachedData();
                multipleCheckListService.resetCondition();
                $state.go('menu');
                $ionicViewSwitcher.nextDirection("back");
            };

            $scope.toItemList = function(projectId,backUrl,editId){
                multipleCheckListService.clearCachedData();
                multipleCheckListService.resetCondition();
                $state.go('safety/multipleCheck/multipleCheck-item-list',{projectId:projectId,backUrl:backUrl,editId:editId});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.searchFilter = function (project) {
                if ($scope.searchText != null && $scope.searchText != "") {
                    return project.projectName.indexOf($scope.searchText) != -1;
                } else {
                    return true;
                }
            };

            $scope.clearSearchText = function(){
                $scope.searchText = "";
            };

        }]);
