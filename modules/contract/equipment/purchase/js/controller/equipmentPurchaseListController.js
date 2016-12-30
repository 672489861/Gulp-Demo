angular.module('app.contract.equipment.purchase')
    .controller('EquipmentPurchaseListController', ['$scope', '$state', '$ionicHistory', '$ionicModal', '$ionicScrollDelegate', 'EquipmentPurchaseService','$ionicViewSwitcher', function ($scope, $state, $ionicHistory, $ionicModal, $ionicScrollDelegate, EquipmentPurchaseService,$ionicViewSwitcher) {

        $scope.condition = EquipmentPurchaseService.getCondition();

        $scope.$on('$ionicView.loaded', function () {
            $scope.purchaseList = EquipmentPurchaseService.getServiceData();
            $scope.hasNextPage = EquipmentPurchaseService.hasNextPage();
        });

        //加载数据
        $scope.loadListData = function () {
            EquipmentPurchaseService.loadListData(function () {
                $scope.fillData();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        // 下拉刷新
        $scope.refreshListData = function () {
            EquipmentPurchaseService.refreshListData(function () {
                $scope.fillData();
                $scope.$broadcast("scroll.refreshComplete");
            });
        };

        //填充数据
        $scope.fillData = function () {
            $scope.purchaseList = EquipmentPurchaseService.getServiceData();
            $scope.hasNextPage = EquipmentPurchaseService.hasNextPage();
        };

        //搜索数据
        $scope.searchData = function () {
            $scope.modalQueryMore.hide();
            $scope.modal.hide();
            //根据查询条件查询结果集
            EquipmentPurchaseService.clearCachedData();
            $ionicScrollDelegate.scrollTop();
            $scope.loadListData();
        };

        $scope.back = function () {
            // 重置数据
            EquipmentPurchaseService.clearCachedData();
            EquipmentPurchaseService.resetCondition();
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
            EquipmentPurchaseService.clearSearchText();
            $scope.condition = EquipmentPurchaseService.getCondition();
        };
    }]);