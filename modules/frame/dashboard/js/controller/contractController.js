angular.module('app.frame.dashboard')
    .controller('ContractController', ['$scope', 'ContractService',
        function ($scope, ContractService) {

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
                ContractService.getContractList($scope.statisticType, $scope.nowYear, function (name, basis, data) {
                    $scope.cellName = name;
                    $scope.basis = basis;
                    $scope.contractList = data;
                });
            };

        }]);
