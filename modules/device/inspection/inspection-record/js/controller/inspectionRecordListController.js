angular.module('app.device.inspection.inspection-record')
    .controller('InspectionRecordListController', ['$scope', '$state', '$ionicHistory', '$ionicModal', '$ionicScrollDelegate', 'RecordService', '$stateParams',
        function ($scope, $state, $ionicHistory, $ionicModal, $ionicScrollDelegate, recordService, $stateParams) {

            $scope.condition = recordService.getCondition();

            //加载数据
            $scope.loadListData = function () {
                recordService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            //填充数据
            $scope.fillData = function () {
                $scope.recordList = recordService.getRecordList();
                $scope.hasNextPage = recordService.hasNextPage();
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
                $scope.recordList = recordService.getRecordList();
                $scope.hasNextPage = recordService.hasNextPage();
                if ($stateParams.success) {
                    $scope.refreshListData();
                }
            });


            // 下拉刷新
            $scope.refreshListData = function () {
                recordService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };
            // 重置数据
            $scope.back = function () {
                recordService.clearCachedData();
                recordService.resetCondition();
                $ionicHistory.goBack();
            };

            //搜索数据
            $scope.searchData = function () {
                //根据查询条件查询结果集
                recordService.clearCachedData();
                $ionicScrollDelegate.scrollTop();
            };

        }]);
