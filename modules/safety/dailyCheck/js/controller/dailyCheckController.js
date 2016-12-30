angular.module('app.safety.dailyCheck')
    .controller('dailyCheckListController',['$scope','$state', '$ionicHistory',
        '$ionicModal','$ionicPopup','dailyCheckService','$ionicScrollDelegate',
        '$filter','LocalStorageService','$ionicViewSwitcher',
        function ($scope, $state,$ionicHistory,
                  $ionicModal,$ionicPopup,dailyCheckService,$ionicScrollDelegate,
                  $filter,LocalStorageService,$ionicViewSwitcher) {

            $scope.condition = dailyCheckService.getCondition();

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.refreshListData();
                $ionicScrollDelegate.scrollTop();
                var localData= JSON.parse(LocalStorageService.get('dailyCheckList'));
                if(localData == undefined || localData.length <= 0){
                    $scope.showDrafts =false;
                    $scope.localDataLength = 0;
                }else{
                    $scope.showDrafts =true;
                    $scope.localDataLength = localData.length;
                }
            });

            //加载数据
            $scope.loadListData = function () {
                dailyCheckService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            // 下拉刷新
            $scope.refreshListData = function () {
                dailyCheckService.clearCachedData();
                dailyCheckService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            //填充数据
            $scope.fillData = function () {
                $scope.dailyCheckList = dailyCheckService.getServiceData();
                $scope.hasNextPage = dailyCheckService.hasNextPage();
                $scope.right = dailyCheckService.getRight();
            };

            //搜索数据
            $scope.searchData = function () {
                $scope.modalQueryType.hide();
                //根据查询条件查询结果集
                dailyCheckService.clearCachedData();
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
                            template: '开始时间不能大于结束时间！'
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

            //清空查询条件
            $scope.clearSearchText = function () {
                dailyCheckService.resetCondition();
                $scope.condition = dailyCheckService.getCondition();
            };

            $scope.back = function () {
                // 重置数据
                dailyCheckService.clearCachedData();
                dailyCheckService.resetCondition();
                $state.go('menu');
                $ionicViewSwitcher.nextDirection("back");
            };

            $scope.toAdd = function(){
                dailyCheckService.clearCachedData();
                dailyCheckService.resetCondition();
                $state.go('safety/dailyCheck/dailyCheck-add', {backUrl: 'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.toDraftsList = function(){
                dailyCheckService.clearCachedData();
                dailyCheckService.resetCondition();
                $state.go('safety/dailyCheck/dailyCheck-drafts-list');
                $ionicViewSwitcher.nextDirection("forward");
            };

            //控制详细信息跳转
            $scope.toDetail = function(id,checkerId,solverId,nodeName){
                var right = dailyCheckService.getRight();
                var userId = dailyCheckService.getUserId();
                if(nodeName == '草稿箱'){
                    $state.go('safety/dailyCheck/dailyCheck-edit', {id: id,backUrl: 'safety/dailyCheck/dailyCheck-list'});
                }else if(nodeName == '处理人审核'){
                    if(right.solver && solverId==userId){
                        $state.go('safety/dailyCheck/dailyCheck-solve',{id:id});
                    }else{
                        $state.go('safety/dailyCheck/dailyCheck-detail', {id: id});
                    }
                }else if(nodeName == '复查人审核'){
                    if(right.rechecker){
                        $state.go('safety/dailyCheck/dailyCheck-recheck',{id:id});
                    }else{
                        $state.go('safety/dailyCheck/dailyCheck-detail', {id: id});
                    }
                }else if(nodeName == '审批通过'){
                    $state.go('safety/dailyCheck/dailyCheck-detail', {id: id});
                }else if(nodeName == '审批不通过'){
                    if(right.solver && solverId == userId){
                        $state.go('safety/dailyCheck/dailyCheck-solve',{id:id});
                    }else{
                        $state.go('safety/dailyCheck/dailyCheck-detail', {id: id});
                    }
                }
                $ionicViewSwitcher.nextDirection("forward");
            };


            $scope.isqueryType = false;
            $scope.isqueryMore = false;
            $scope.isCheckType = false;
            $scope.isProblem = false;

            //初始化开始时间
            $scope.startTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.startTime = $filter('date')($scope.startTime.date, 'yyyy-MM-dd');
                    dailyCheckService.setStartTime($scope.condition.startTime);
                    $scope.startTimerPopup.close();
                }
            });
            //初始化结束时间
            $scope.endTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.endTime = $filter('date')($scope.endTime.date, 'yyyy-MM-dd');
                    dailyCheckService.setEndTime($scope.condition.endTime);
                    $scope.endTimerPopup.close();
                }
            });

            $scope.openStartTime = function () {
                $scope.startTimerPopup = $ionicPopup.show({
                    templateUrl: "start-time.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.startTimerPopup.then(function(res) {
                    console.log('Tapped!', res);
                });
            };
            $scope.openEndTime = function () {
                $scope.endTimerPopup = $ionicPopup.show({
                    templateUrl: "end-time.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.endTimerPopup.then(function(res) {
                    console.log('Tapped!', res);
                });
            };
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

            $scope.openCheckType = function () {
                $scope.isCheckType = true;
            };

            $scope.openProblem = function () {
                $scope.isProblem = true;
            };
            $scope.closeCheckType=function(name){
                $scope.isCheckType = false;
                $scope.condition.checkTypeName = name;
            };
            $scope.closeProblem=function(name){
                $scope.isProblem = false;
                $scope.condition.hasProblemName = name;
            };
        }]);
