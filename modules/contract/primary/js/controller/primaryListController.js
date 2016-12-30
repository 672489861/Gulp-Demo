angular.module('app.contract.primary')
    .controller('PrimaryListController', ['$scope', '$state', '$ionicHistory', '$ionicModal', '$ionicScrollDelegate', 'PrimaryService', '$ionicPopup', '$filter', '$ionicViewSwitcher',
        function ($scope, $state, $ionicHistory, $ionicModal, $ionicScrollDelegate, primaryService, $ionicPopup, $filter, $ionicViewSwitcher) {

            $scope.isProjectStatus = false;
            $scope.isWorkCategory = false;
            $scope.condition = primaryService.getCondition();
            /*初始化开始*/
            //初始化签订时间
            $scope.signTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.signTime = $filter('date')($scope.signTime.date, 'yyyy-MM-dd');
                    $scope.signTimerPopup.close();
                }
            });
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
            //填充数据
            $scope.fillData = function () {
                $scope.primaryList = primaryService.getPrimaryList();
                $scope.hasNextPage = primaryService.hasNextPage();
            };
            //合同类型查询条件弹框
            $ionicModal.fromTemplateUrl('contract-type.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalContractTypeUp = modal;
            });
            //更多删选弹框
            $ionicModal.fromTemplateUrl('query-more.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMore = modal;
            });
            /*初始化结束*/


            /*事件处理开始*/
            //关闭更多删除中弹出框背景
            $scope.close = function () {
                $scope.isProjectStatus = false;
                $scope.isWorkCategory = false;
            };
            //刚开始初始化，程序自动调用
            $scope.$on('$ionicView.loaded', function () {
                $scope.primaryList = primaryService.getPrimaryList();
                $scope.hasNextPage = primaryService.hasNextPage();
            });
            //处理打开签订时间弹框
            $scope.openSignTime = function () {
                $scope.signTimerPopup = $ionicPopup.show({
                    templateUrl: "sign-time.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.signTimerPopup.then(function (res) {
                    console.log('Tapped!', res);
                });
            };
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
            //加载数据
            $scope.loadListData = function () {
                primaryService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
            // 下拉刷新
            $scope.refreshListData = function () {
                primaryService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };
            // 重置数据
            $scope.back = function () {
                primaryService.clearCachedData();
                primaryService.resetCondition();
                $state.go('menu');
                $ionicViewSwitcher.nextDirection("back");

            };
            //打开合同类型弹框
            $scope.openContractType = function () {
                $scope.modalContractTypeUp.show();
            };
            //关闭合同类型弹框
            $scope.hideContractType = function () {
                $scope.modalContractTypeUp.hide();
            };
            //打开更多删选弹框
            $scope.openQueryMore = function () {
                $scope.modalQueryMore.show();
            };
            //关闭更多删选弹框
            $scope.hideQueryMore = function () {
                $scope.modalQueryMore.hide();
            };
            //展开工程状态列表
            $scope.openProjectStatus = function () {
                $scope.isProjectStatus = true;
            };
            //关闭工程状态列表并回显数据
            $scope.closeProjectStatus = function (name) {
                $scope.isProjectStatus = false;
                $scope.condition.psName = name;
            };
            //展开工程类别列表
            $scope.openWorkCategory = function () {
                $scope.isWorkCategory = true;
            };
            //关闭工程类别列表并回显数据
            $scope.closeWorkCategory = function (name) {
                $scope.isWorkCategory = false;
                $scope.condition.wcName = name;
            };
            //清空查询条件
            $scope.clearSearchText = function () {
                primaryService.clearSearchText();
                $scope.condition = primaryService.getCondition();
            };
            //搜索数据
            $scope.searchData = function () {
                $scope.modalContractTypeUp.hide();
                //根据查询条件查询结果集
                primaryService.clearCachedData();
                $ionicScrollDelegate.scrollTop();
                if ($scope.condition.startTime && $scope.condition.endTime) {
                    var beginTimes = $scope.condition.startTime.substring(0, 10).split('-');
                    var endTimes = $scope.condition.endTime.substring(0, 10).split('-');
                    var beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + $scope.condition.startTime.substring(10, 19);
                    var endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + $scope.condition.endTime.substring(10, 19);
                    var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
                    if (a < 0) {
                        $ionicPopup.alert({
                            title: '警告消息',
                            template: '开工时间不能大于竣工时间！'
                        });
                    } else {
                        $scope.modalQueryMore.hide();
                        $scope.loadListData();
                    }
                } else {
                    $scope.modalQueryMore.hide();
                    $scope.loadListData();
                }
            };

        }]);