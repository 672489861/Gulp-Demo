/**
 * Created by zjw on 2016/11/2.
 */
angular.module('app.frame.dashboard')
    .controller('BusinessManagementController', ['$scope', '$state', 'SubscribeModuleService', 'BusinessManagementService', 'ContractService', 'ResponserService',
        function ($scope, $state, subscribeModuleService, businessManagementService, contractService, responserService) {

            $scope.$on('$ionicView.beforeEnter', function () {
                // 拉取企业管理Tab,默认加载第一个slide的数据
                $scope.selectedModules = businessManagementService.getSelectedModules();
                $scope.slideHasChanged($scope.selectedModules[0].moduleId, $scope.selectedModules[0].moduleName, $scope.selectedModules[0].shortName);
            });

            $scope.getUrl = function (module) {
                return module.url;
            };

            $scope.back = function () {
                $state.go("tabs.dashboard");
            };

            $scope.slideHasChanged = function (moduleId, moduleName, shortName) {
                // 初始年份
                $scope.nowYear = contractService.getNowYear() + '';
                // 初始化年份列表
                $scope.yearList = contractService.getYearList();

                if (moduleId == 18) {
                    // 初始化责任人（按分公司统计）- 集团
                    responserService.getResponserList('1', $scope.nowYear, function (basis, data) {
                        $scope.responserList = data;
                    });
                } else if (moduleId == 6 && shortName == "合同") {
                    // 初始化承包合同（按分公司统计）- 集团
                    contractService.getContractList('1', $scope.nowYear, function (name, basis, data) {
                        $scope.cellName = name;
                        $scope.basis = basis;
                        $scope.contractList = data;
                    });
                }
            };

        }]);