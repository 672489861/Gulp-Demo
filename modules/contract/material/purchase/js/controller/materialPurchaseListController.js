angular.module('app.contract.material.purchase')
    .controller('MaterialPurchaseListController', ['$scope', '$state', '$ionicHistory', '$ionicModal', '$ionicScrollDelegate', 'MaterialPurchaseService','$ionicViewSwitcher', function ($scope, $state, $ionicHistory, $ionicModal, $ionicScrollDelegate, MaterialPurchaseService,$ionicViewSwitcher) {

        $scope.condition = MaterialPurchaseService.getCondition();

        $scope.$on('$ionicView.loaded', function () {
            $scope.purchaseList = MaterialPurchaseService.getServiceData();
            $scope.hasNextPage = MaterialPurchaseService.hasNextPage();
        });

        //加载数据
        $scope.loadListData = function () {
            MaterialPurchaseService.loadListData(function () {
                $scope.fillData();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        // 下拉刷新
        $scope.refreshListData = function () {
            MaterialPurchaseService.clearCachedData();
            MaterialPurchaseService.refreshListData(function () {
                $scope.fillData();
                $scope.$broadcast("scroll.refreshComplete");
            });
        };

        //填充数据
        $scope.fillData = function () {
            $scope.purchaseList = MaterialPurchaseService.getServiceData();
            $scope.hasNextPage = MaterialPurchaseService.hasNextPage();
        };

        //搜索数据
        $scope.searchData = function () {
            $scope.modalQueryMore.hide();
            $scope.modal.hide();
            //根据查询条件查询结果集
            MaterialPurchaseService.clearCachedData();
            $ionicScrollDelegate.scrollTop();
            $scope.loadListData();
        };

        $scope.back = function () {
            // 重置数据
            MaterialPurchaseService.clearCachedData();
            MaterialPurchaseService.resetCondition();
            $state.go('menu');
            $ionicViewSwitcher.nextDirection("back");
        };


        //查询条件
        $ionicModal.fromTemplateUrl('contract-status.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        //合同状态
        $scope.openContractStatus = function () {
            $scope.modal.show();
        };

        $scope.hideContractStatus = function () {
            $scope.modal.hide();
        };

        //更多筛选
        $ionicModal.fromTemplateUrl('query-more.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalQueryMore = modal;
        });
        //打开更多筛选弹框
        $scope.openQueryMore = function () {
            $scope.modalQueryMore.show();
        };
        //关闭更多筛选弹框
        $scope.hideQueryMore = function () {
            $scope.modalQueryMore.hide();
        };

        //清空查询条件
        $scope.clearSearchText = function () {
            MaterialPurchaseService.resetCondition();
            $scope.condition = MaterialPurchaseService.getCondition();
        };
    }]);