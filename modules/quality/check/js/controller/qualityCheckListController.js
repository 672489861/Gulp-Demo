angular.module('app.quality.check')
    .controller('qualityCheckListController',['$scope','$state',
        '$ionicHistory','$ionicModal','$ionicPopup','qualityCheckService',
        '$ionicScrollDelegate','$filter','LocalStorageService','$ionicViewSwitcher',
        function ($scope, $state,$ionicHistory,$ionicModal,$ionicPopup,
                  qualityCheckService,$ionicScrollDelegate,$filter,LocalStorageService,$ionicViewSwitcher) {

            $scope.condition = qualityCheckService.getCondition();

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.refreshListData();
                $ionicScrollDelegate.scrollTop();
                var localData= JSON.parse(LocalStorageService.get('qualityCheckList'));
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
                qualityCheckService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            // 下拉刷新
            $scope.refreshListData = function () {
                qualityCheckService.clearCachedData();
                qualityCheckService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            //填充数据
            $scope.fillData = function () {
                $scope.qualityCheckList = qualityCheckService.getServiceData();
                $scope.hasNextPage = qualityCheckService.hasNextPage();
                $scope.right = qualityCheckService.getRight();
            };

            //搜索数据
            $scope.searchData = function () {
                $scope.modalQueryType.hide();
                //根据查询条件查询结果集
                qualityCheckService.clearCachedData();
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
                qualityCheckService.resetCondition();
                $scope.condition = qualityCheckService.getCondition();
            };

            $scope.back = function () {
                // 重置数据
                qualityCheckService.clearCachedData();
                qualityCheckService.resetCondition();
                $state.go('menu');
                $ionicViewSwitcher.nextDirection("back");
            };

            $scope.toAdd = function(){
                qualityCheckService.clearCachedData();
                qualityCheckService.resetCondition();
                $state.go('quality/check/quality-add', {backUrl: 'quality/check/quality-list'});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.toDraftsList = function(){
                qualityCheckService.clearCachedData();
                qualityCheckService.resetCondition();
                $state.go('quality/check/quality-drafts-list');
                $ionicViewSwitcher.nextDirection("forward");
            };

            //控制详细信息跳转
            $scope.toDetail = function(id,checkerId,solverId,nodeName){
                var right = qualityCheckService.getRight();
                var userId = qualityCheckService.getUserId();
                if(nodeName == '草稿箱'){
                    $state.go('quality/check/quality-edit', {id: id,backUrl: 'quality/check/quality-list'});
                }else if(nodeName == '处理人审核'){
                    if(right.solver && solverId==userId){
                        $state.go('quality/check/quality-solve',{id:id});
                    }else{
                        $state.go('quality/check/quality-detail', {id: id});
                    }
                }else if(nodeName == '复查人审核'){
                    if(right.rechecker){
                        $state.go('quality/check/quality-recheck',{id:id});
                    }else{
                        $state.go('quality/check/quality-detail', {id: id});
                    }
                }else if(nodeName == '审批通过'){
                    $state.go('quality/check/quality-detail', {id: id});
                }else if(nodeName == '审批不通过'){
                    if(right.solver && solverId == userId){
                        $state.go('quality/check/quality-solve',{id:id});
                    }else{
                        $state.go('quality/check/quality-detail', {id: id});
                    }
                }
                $ionicViewSwitcher.nextDirection("forward");
            };


            $scope.isqueryType = false;
            $scope.isqueryMore = false;
            $scope.isProblem = false;

            //初始化开始时间
            $scope.startTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.startTime = $filter('date')($scope.startTime.date, 'yyyy-MM-dd');
                    qualityCheckService.setStartTime($scope.condition.startTime);
                    $scope.startTimerPopup.close();
                }
            });
            //初始化结束时间
            $scope.endTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.endTime = $filter('date')($scope.endTime.date, 'yyyy-MM-dd');
                    qualityCheckService.setEndTime($scope.condition.endTime);
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

            $scope.openProblem = function () {
                $scope.isProblem = true;
            };
            $scope.closeProblem=function(name){
                $scope.isProblem = false;
                $scope.condition.hasProblemName = name;
            };
        }]);
