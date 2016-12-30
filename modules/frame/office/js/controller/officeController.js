angular.module('app.frame.office',['com.yt.mui', 'app.service', 'app.frame.login']).controller('OfficeController', ['$scope', '$state','$ionicPopup', 'OfficeService', 'UserService', 'LocalStorageService', '$stateParams', 'LoginService', 'DashboardService', 'SubscribeModuleService',
        function ($scope, $state,$ionicPopup, officeService, userService, localStorageService, $stateParams, loginService, dashboardService, subscribeModuleService) {

            $scope.$on('$ionicView.loaded', function () {
                // 消息-获取当前用户最大组织下的项目部信息
                subscribeModuleService.getUserTypeInfo(function (data) {
                    subscribeModuleService.setMaxTypeObj(data);
                    if (data.type == 1) {
                        subscribeModuleService.getGroupProject(data.rootId, function (data) {
                            // 为每个模块添加项目部
                            subscribeModuleService.setProjectModulesOrg(data);
                            subscribeModuleService.setSubscribeModules();
                        });
                    } else if (data.type == 2) {
                        subscribeModuleService.getSubProject(data.rootId, function (data) {
                            subscribeModuleService.setProjectModulesOrg(data);
                            subscribeModuleService.setSubscribeModules();
                        });
                    } else {
                        // 设置面板显示
                        subscribeModuleService.setSubscribeModules();
                    }
                });
            });

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.orgList = userService.getOrgList();
                $scope.orgName = officeService.getRootOrgName();
                officeService.getMenuList(function (menuTree) {
                    $scope.menuList = menuTree.getNodes();
                });
                var width = window.screen.width / 414;
                document.getElementById("ytH5Viewport").setAttribute('content', 'width=414, initial-scale=' + width + ', maximum-scale=' + width + ', user-scalable=no');
                $scope.getNewsNum();
            });

            $scope.getNewsNum = function () {
                dashboardService.queryNewsNum(function () {
                    $scope.badges = dashboardService.getNewsBadge();
                });
            };

            var eventHandler = {
                handleEvents: function () {
                    this.handleChangeOrg();
                    this.handleSearchMenu();
                    this.handleSelectedMenu();
                },

                handleSearchMenu: function () {
                    //清空查询条件
                    $scope.clearSearchText = function () {
                        $scope.searchText = '';
                    };
                },

                handleChangeOrg: function () {
                    //切换组织机构
                    $scope.showOrgList = false;

                    $scope.changeOrg = function (id, orgName) {
                        $scope.badges.num = 0;
                        // 重置消息
                        dashboardService.clearCachedData();
                        //切换组织机构
                        $scope.showOrgList = false;
                        localStorageService.setObject("currentOrgId", id);

                        // 重新设置userInfo
                        loginService.cacheCurrentUserInfo(function () {
                        });

                        officeService.getMenuList(function (menuTree) {
                            $scope.menuList = menuTree.getNodes();
                        }, true);

                        officeService.setOrgName(orgName);

                        $scope.orgName = officeService.getRootOrgName();

                        $scope.getNewsNum();
                    };

                    $scope.switchOrgList = function () {
                        $scope.showOrgList = !$scope.showOrgList;
                    };
                },

                handleSelectedMenu: function () {
                    $scope.selectedMenu = function (data) {
                        $state.go('menu', {menuList: data});
                    }
                }

            };

            eventHandler.handleEvents();
        }]);