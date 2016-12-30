angular.module('app.contract.equipment.lease')
    .controller('EquipmentLeaseListController', ['$scope', '$state', '$ionicHistory', '$ionicModal', '$ionicScrollDelegate', 'EquipmentLeaseService','$ionicViewSwitcher', function ($scope, $state, $ionicHistory, $ionicModal, $ionicScrollDelegate, EquipmentLeaseService,$ionicViewSwitcher) {

        $scope.condition = EquipmentLeaseService.getCondition();

        $scope.$on('$ionicView.loaded', function () {
            $scope.leaseList = EquipmentLeaseService.getServiceData();
            $scope.hasNextPage = EquipmentLeaseService.hasNextPage();
        });

        //加载数据
        $scope.loadListData = function () {
            EquipmentLeaseService.loadListData(function () {
                $scope.fillData();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        // 下拉刷新
        $scope.refreshListData = function () {
            EquipmentLeaseService.refreshListData(function () {
                $scope.fillData();
                $scope.$broadcast("scroll.refreshComplete");
            });
        };

        //填充数据
        $scope.fillData = function () {
            $scope.leaseList = EquipmentLeaseService.getServiceData();
            $scope.hasNextPage = EquipmentLeaseService.hasNextPage();
        };

        //搜索数据
        $scope.searchData = function () {
            $scope.modalQueryMore.hide();
            $scope.modal.hide();
            //根据查询条件查询结果集
            EquipmentLeaseService.clearCachedData();
            $ionicScrollDelegate.scrollTop();
            $scope.loadListData();
        };

        $scope.back = function () {
            // 重置数据
            EquipmentLeaseService.clearCachedData();
            EquipmentLeaseService.resetCondition();
            $state.go('menu');
            $ionicViewSwitcher.nextDirection("back");        };


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
            EquipmentLeaseService.clearSearchText();
            $scope.condition = EquipmentLeaseService.getCondition();
        };

        //初始化开工时间
        $scope.startTime = YTM.initDatePicker({
            callback: function () {
                $scope.condition.startTime = $filter('date')($scope.startTime.date, 'yyyy-MM-dd');
                $scope.startTimerPopup.close();
            }
        });
        //初始化竣工时间
        $scope.endTime = YTM.initDatePicker({
            callback: function () {
                $scope.condition.endTime = $filter('date')($scope.endTime.date, 'yyyy-MM-dd');
                $scope.endTimerPopup.close();
            }
        });

        //处理打开开工时间弹框
        $scope.openStartTime = function () {
            $scope.startTimerPopup = $ionicPopup.show({
                templateUrl: "start-time.html",
                scope: $scope,
                cssClass: 'customTimerPopover'
            });
            $scope.startTimerPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };
        //处理打开竣工时间弹框
        $scope.openEndTime = function () {
            $scope.endTimerPopup = $ionicPopup.show({
                templateUrl: "end-time.html",
                scope: $scope,
                cssClass: 'customTimerPopover'
            });
            $scope.endTimerPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };
    }]);