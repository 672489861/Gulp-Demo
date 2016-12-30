angular.module('app.device.maintain.maintain-record')
    .controller('MaintainRecordListController',['$scope','$state','$ionicHistory','$ionicModal','$ionicScrollDelegate','MaintainRecordService','$stateParams',
        function($scope,$state,$ionicHistory,$ionicModal,$ionicScrollDelegate,maintainRecordService,$stateParams){

            $scope.condition = maintainRecordService.getCondition();

            //加载数据
            $scope.loadListData = function () {
                maintainRecordService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            //填充数据
            $scope.fillData = function () {
                $scope.recordList = maintainRecordService.getRecordList();
                $scope.hasNextPage = maintainRecordService.hasNextPage();
            };

            $scope.filterRecordList = function (value) {
                // clone一个副本 用于解决Filter显示无数据问题
                $scope.cloneRecordList = $scope.recordList.concat([]);
                if (value != undefined) {
                    for (var i = $scope.cloneRecordList.length - 1; i >= 0; i--) {
                        if ($scope.cloneRecordList[i].number.indexOf(value) == -1) {
                            $scope.cloneRecordList.splice(i, 1);
                        }
                    }
                }
            };

            //刚开始初始化，程序自动调用
            $scope.$on('$ionicView.loaded', function () {
                $scope.recordList = maintainRecordService.getRecordList();
                $scope.hasNextPage = maintainRecordService.hasNextPage();
                if($stateParams.success){
                    $scope.refreshListData();
                }
            });


            // 下拉刷新
            $scope.refreshListData = function () {
                maintainRecordService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };
            // 重置数据
            $scope.back = function () {
                maintainRecordService.clearCachedData();
                maintainRecordService.resetCondition();
                $ionicHistory.goBack();
            };

            //搜索数据
            $scope.searchData = function () {
                //根据查询条件查询结果集
                maintainRecordService.clearCachedData();
                $ionicScrollDelegate.scrollTop();
            };

        }]);
