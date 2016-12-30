angular.module('app.device.maintain.maintain-remind')
    .controller('MaintainRemindListController',['$scope','$state','$ionicHistory','$ionicModal','$ionicScrollDelegate','MaintainRemindService',
            function($scope,$state,$ionicHistory,$ionicModal,$ionicScrollDelegate,maintainRemindService){


                    $scope.condition = maintainRemindService.getCondition();
                    //刚开始初始化，程序自动调用
                    $scope.$on('$ionicView.loaded', function () {
                            $scope.remindList = maintainRemindService.getRemindList();
                            $scope.hasNextPage = maintainRemindService.hasNextPage();
                    });

                    //填充数据
                    $scope.fillData = function () {
                            $scope.remindList = maintainRemindService.getRemindList();
                            $scope.hasNextPage = maintainRemindService.hasNextPage();
                    };

                    $scope.filterRemindList = function (value) {
                            // clone一个副本 用于解决Filter显示无数据问题
                            $scope.cloneRemindList = $scope.remindList.concat([]);
                            if (value != undefined) {
                                    for (var i = $scope.cloneRemindList.length - 1; i >= 0; i--) {
                                            if ($scope.cloneRemindList[i].number.indexOf(value) == -1) {
                                                    $scope.cloneRemindList.splice(i, 1);
                                            }
                                    }
                            }
                    };

                    // 下拉刷新
                    $scope.refreshListData = function () {
                            maintainRemindService.refreshListData(function () {
                                    $scope.fillData();
                                    $scope.$broadcast("scroll.refreshComplete");
                            });
                    };
                    //加载数据
                    $scope.loadListData = function () {
                            maintainRemindService .loadListData(function () {
                                    $scope.fillData();
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                            });
                    };
                    // 重置数据
                    $scope.back = function () {
                            maintainRemindService.clearCachedData();
                            maintainRemindService.resetCondition();
                            $ionicHistory.goBack();
                    };

                    //搜索数据
                    $scope.searchData = function () {
                            //根据查询条件查询结果集
                            maintainRemindService.clearCachedData();
                            $ionicScrollDelegate.scrollTop();
                    };

            }]);
