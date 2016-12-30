/**
 * Created by zjw on 2016/11/2.
 */
angular.module('app.frame.dashboard')
    .controller('ProjectManagementController', ['$scope', '$state', 'SubscribeModuleService', 'ProjectManagementService', 'ContractService', 'CommonService',
        function ($scope, $state, subscribeModuleService, projectManagementService, contractService, commonService) {

            $scope.$on('$ionicView.beforeEnter', function () {
                // 拉取项目管理Tab,默认加载第一个slide的数据
                commonService.bindScope($scope);
                $scope.selectedModules = projectManagementService.getSelectedModules();
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
                if (moduleId == 10) {
                    $scope.loadDataByM();
                } else if (moduleId == 12) {
                    $scope.loadDataByD();
                } else if (moduleId == 13) {
                    $scope.loadDataBySubContract();
                } else if (moduleId == 6 && shortName == "合同-项目部") {
                    $scope.loadDataByC();
                }
            };

        }]);