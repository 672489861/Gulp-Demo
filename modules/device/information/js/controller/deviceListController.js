angular.module('app.device.information')
    .controller('DeviceListController',['$scope','$state','$ionicHistory','$ionicModal','$ionicScrollDelegate','InformationService','$ionicPopup', '$filter',
        function($scope,$state,$ionicHistory,$ionicModal,$ionicScrollDelegate,informationService,$ionicPopup,$filter){
            $scope.isDeviceKinds = false;
            $scope.isDeviceFrom = false;
            $scope.isDeviceMark = false;

            
            $scope.condition = informationService.getCondition();

            //初始化进场时间（起）
            $scope.startTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.startTime = $filter('date')($scope.startTime.date, 'yyyy-MM-dd');
                    $scope.startTimerPopup.close();
                }
            });
            //初始化进场时间（止）
            $scope.endTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.endTime = $filter('date')($scope.endTime.date, 'yyyy-MM-dd');
                    $scope.endTimerPopup.close();
                }
            });
            //设备状态查询条件弹框
            $ionicModal.fromTemplateUrl('query-type.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryTypeUp = modal;
            });
            informationService.getStatuses(function (data) {
                $scope.statuses = data;
            });
            $scope.openQueryTypeUp = function () {
                $scope.modalQueryTypeUp.show();
            };
            $scope.hideQueryType = function () {
                $scope.modalQueryTypeUp.hide();
            };


            //更多删选弹框
            $ionicModal.fromTemplateUrl('query-more.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMore = modal;
            });
            $scope.openQueryMore = function () {
                $scope.modalQueryMore.show();
            };



            /*事件处理开始*/
            //关闭更多删除中弹出框背景
            $scope.close = function () {
                $scope.isDeviceKinds = false;
                $scope.isDeviceFrom = false;
                $scope.isDeviceMark = false;
            };
            //初始化列表
            $scope.$on('$ionicView.loaded', function () {
                $scope.deviceInfoList = informationService.getDeviceInfoList();
                $scope.hasNextPage = informationService.hasNextPage();
            });

            //处理打开进场时间（起）弹框
            $scope.openStartTime = function () {
                $scope.startTimerPopup = $ionicPopup.show({
                    templateUrl: "start-time.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.startTimerPopup.then(function (res) {
                    
                });
            };
            //处理打开进场时间（止）弹框
            $scope.openEndTime = function () {
                $scope.endTimerPopup = $ionicPopup.show({
                    templateUrl: "end-time.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.endTimerPopup.then(function (res) {
                    
                });
            };

            //打开与关闭设备类别列表
            informationService.getCategories(function (data) {
                $scope.categories = data;
            });
            $scope.openDeviceKinds = function () {
                $scope.isDeviceKinds = true;
            };
            $scope.closeDeviceKinds = function (name) {
                $scope.isDeviceKinds = false;
                $scope.condition.categoryName = name;
            };

            //打开与关闭设备来源列表
            informationService.getSources(function (data) {
                $scope.sources = data;
            });
            $scope.openDeviceFrom = function () {
                $scope.isDeviceFrom = true;
            };
            $scope.closeDeviceFrom = function (name) {
                $scope.isDeviceFrom = false;
                $scope.condition.sourceName = name;
            };

            //打开与关闭设备标识列表
            informationService.getIdentities(function (data) {
                $scope.identities = data;
            });
            $scope.openDeviceMark = function () {
                $scope.isDeviceMark = true;
            };
            $scope.closeDeviceMark = function (name) {
                $scope.isDeviceMark = false;
                $scope.condition.markName = name;
            };

            //设备提供单位
            $ionicModal.fromTemplateUrl('company.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalCompanyList = modal;
            });
            $scope.openCompanyList = function () {
                $scope.modalCompanyList.show();
            };
            $scope.hideCompanyList = function (unitName) {
                $scope.condition.provideName = unitName;
                $scope.modalCompanyList.hide();
            };
            $scope.hideCompany = function (unitName) {
                $scope.condition.provideName = unitName;
                $scope.modalCompanyList.hide();
            };

            //设备供应商提供单位
            $ionicModal.fromTemplateUrl('supply.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalSupplyList = modal;
            });
            $scope.openSupplyList = function () {
                $scope.modalSupplyList.show();
            };
            $scope.hideSupplyList = function (unitName) {
                $scope.condition.supplyName = unitName;
                $scope.modalSupplyList.hide();
            };
            $scope.hideSupply = function (unitName) {
                $scope.condition.supplyName = unitName;
                $scope.modalSupplyList.hide();
            };

            //清空查询条件
            $scope.clearSearchText = function () {
                informationService.clearSearchText();
                $scope.condition = informationService.getCondition();
            };


            //加载数据
            $scope.loadListData = function () {
                informationService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            //加载提供单位列表
            informationService.getProvideList(function(data){
                $scope.provideInfo = data;
            });
            //加载供应商数据
            informationService.getDeviceSupply(function(data){
                $scope.supplysInfo = data;
            });



            //下拉刷新
            $scope.refreshListData = function(){
                informationService.refreshListData(function(){
                    $scope.condition = informationService.getCondition();
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                })
            };


            //填充数据
            $scope.fillData = function(){
                $scope.deviceInfoList = informationService.getDeviceInfoList();
                $scope.hasNextPage = informationService.hasNextPage();
            };


            //重置数据
            $scope.back = function(){
                informationService.clearCachedData();
                informationService.resetCondition();
                $ionicHistory.goBack();
            };


            //查询条件
            $scope.searchData = function () {
                $scope.modalQueryTypeUp.hide();
                //根据查询条件查询结果集
                informationService.clearCachedData();
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
                            template: '进场时间（止）不能小于进场时间（起）！'
                        });
                    } else {
                        $scope.modalQueryMore.hide();
                        $scope.loadListData();
                    }
                }else{
                    $scope.modalQueryMore.hide();
                    $scope.loadListData();
                }
            };

        }]);
