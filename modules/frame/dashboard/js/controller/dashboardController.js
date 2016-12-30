angular.module('app.frame.dashboard')
    .controller('DashboardController', ['$scope', '$ionicModal', 'DashboardService', '$state', '$stateParams',
        'SubscribeModuleService', 'ContractService', 'ResponserService', 'ContractProjectService', 'UserService',
        'LocalStorageService', 'LoginService', 'OfficeService', 'CommonService',
        function ($scope, $ionicModal, dashboardService, $state, $stateParams,
                  subscribeModuleService, contractService, responserService, contractProjectService, userService,
                  localStorageService, loginService, officeService, commonService) {

            $scope.getUrl = function (module) {
                return module.url;
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
                } else if (moduleId == 10) {
                    $scope.loadDataByM();
                } else if (moduleId == 12) {
                    $scope.loadDataByD();
                } else if (moduleId == 13) {
                    $scope.loadDataBySubContract();
                } else if (moduleId == 6 && shortName == "合同-项目部") {
                    $scope.loadDataByC();
                } else if (moduleId == 6 && shortName == "合同") {
                    // 初始化承包合同（按分公司统计）- 集团
                    contractService.getContractList('1', $scope.nowYear, function (name, basis, data) {
                        $scope.cellName = name;
                        $scope.basis = basis;
                        $scope.contractList = data;
                    });
                }
            };

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.news = dashboardService.getNewsList();
                $scope.hasNextPage = dashboardService.hasNextPage();
                // 获取当前用户订阅的Module
                $scope.selectedModules = subscribeModuleService.getSelectedModules();

                subscribeModuleService.setSelectedProjects();

                $scope.selectProjects = subscribeModuleService.getSelectedProjects();

                var businessModules = [];
                for (var i = 0; i < $scope.selectedModules.length; i++) {
                    if ($scope.selectedModules[i].projects == null) {
                        businessModules.push($scope.selectedModules[i]);
                    }
                }
                if (subscribeModuleService.getMaxTypeObj().type == 3) {
                    $scope.slideBoxTemp = 3; // 项目部身份
                } else if ($scope.selectProjects.length > 0 && subscribeModuleService.getMaxTypeObj().type < 3 && businessModules.length > 0) {
                    $scope.slideBoxTemp = 1; // 集团分公司身份 关注企业 关注了项目
                    // 为了触发slideGo指令
                    $scope.tempModules = [{moduleName: "企业管理", url: "businessManagement"}, {
                        moduleName: "项目管理",
                        url: "projectManagement"
                    }];
                    // 为了触发指令 放入attributes
                    $scope.tempModules.unshift({
                        moduleId: 0,
                        moduleName: "最新动态",
                        shortName: "最新动态",
                        url: "modules/frame/dashboard/news.html"
                    });
                } else if ($scope.selectProjects.length == 0 && subscribeModuleService.getMaxTypeObj().type < 3 && businessModules.length > 0) {
                    $scope.slideBoxTemp = 2; // 集团分公司身份 关注企业 但是没有关注 项目
                } else if ($scope.selectProjects.length > 0 && subscribeModuleService.getMaxTypeObj().type < 3 && businessModules.length == 0) {
                    $scope.slideBoxTemp = 4; // 集团分公司身份 没关注企业 但是关注项目
                } else {
                    $scope.slideBoxTemp = 3; // 默认是3
                }
                if ($scope.slideBoxTemp != 1) {
                    $scope.selectedModules.unshift({
                        moduleId: 0,
                        moduleName: "最新动态",
                        shortName: "最新动态",
                        url: "modules/frame/dashboard/news.html"
                    });
                }
                commonService.bindScope($scope);
            });

            $scope.handleProblem = function (newsId, url, id) {
                // 查询这条消息 获取 orgId,orgName
                dashboardService.queryNewsWithId(newsId, function (result) {
                    // 清除消息缓存
                    dashboardService.clearCachedData();

                    // 设置当前orgId
                    localStorageService.setObject("currentOrgId", result.orgId);

                    // 重新设置当前userInfo
                    loginService.cacheCurrentUserInfo(function () {
                        // 设置orgName
                        officeService.setOrgName(result.orgName);

                        // 重新设置待处理消息角标
                        dashboardService.queryNewsNum(function () {
                        });

                        // 切换到对应url 进行处理
                        $state.go(url, {id: id, backUrl: 'tabs.dashboard'});
                    });
                });
            };

            $scope.goSubscribeModule = function () {
                $state.go("subscribeModule");
            };

            $scope.loadListData = function () {
                dashboardService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.news = dashboardService.getNewsList();
                $scope.hasNextPage = dashboardService.hasNextPage();
            };

            $scope.refreshListData = function () {
                dashboardService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.$on('$ionicView.beforeLeave', function () {
                dashboardService.clearCached();
            });

        }]);
