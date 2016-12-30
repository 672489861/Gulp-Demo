angular.module('app.frame.dashboard')
    .controller('ResponserController', ['$scope', 'ResponserService',
        function ($scope, ResponserService) {

            // 下拉刷新
            $scope.refreshListData = function () {
                $scope.fillData();
                $scope.$broadcast("scroll.refreshComplete");
            };

            // 年份选择事件
            $scope.showDetailByYear = function () {
                $scope.fillData();
            };

            // 统计类型选择事件
            $scope.showDetailByType = function () {
                $scope.fillData();
            };

            // 填充数据
            $scope.fillData = function () {
                ResponserService.getResponserList($scope.statisticType, $scope.nowYear, function (basis, data) {
                    $scope.basis = basis;
                    $scope.responserList = data;
                });
            };

        }]);