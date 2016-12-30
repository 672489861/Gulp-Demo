angular.module('app.market.ep.employee')
    .controller('EmployeeListController', ['$scope', '$ionicModal', 'EmployeeService', '$stateParams', '$state',
        function ($scope, $ionicModal, employeeService, $stateParams, $state) {
            $ionicModal.fromTemplateUrl('query-type.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryTypeUp = modal;
            });

            $scope.openQueryTypeUp = function () {
                $scope.fillDataFlag = true;
                $scope.modalQueryTypeUp.show();
            };

            $ionicModal.fromTemplateUrl('query-type.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function (modal) {
                $scope.modalQueryTypeLeft = modal;
            });

            $scope.openQueryTypeLeft = function () {
                $scope.fillDataFlag = false;
                $scope.modalQueryTypeLeft.show();
            };


            $scope.hideQueryType = function (org) {
                $scope.modalQueryTypeLeft.hide();
                $scope.modalQueryTypeUp.hide();
                if (org) {
                    $scope.condition.org = {orgId: org.id, orgName: org.name};
                    if ($scope.fillDataFlag) {
                        $scope.reloadData();
                    }
                }
            };
            $scope.reloadData = function () {
                employeeService.reloadData(function () {
                    $scope.fillData();
                })
            };
            $ionicModal.fromTemplateUrl('query-more.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMore = modal;
            });

            $scope.openQueryMore = function () {
                $scope.modalQueryMore.show();
            };

            $scope.opensex = function () {
                $scope.sex = true;
            };

            $scope.openInsure = function () {
                $scope.insure = true;
            };
            $scope.close = function () {
                $scope.sex = false;
                $scope.insure = false;
            };
            //刷新
            $scope.refreshListData = function () {
                employeeService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                })
            };
            $scope.hasNextPage = true;

            //返回时,清除搜索条件
            $scope.back = function () {
                employeeService.resetCondition();
                employeeService.resetCachedData();
                $state.go('market-management');
            };
            //分页加载
            $scope.loadListData = function () {
                employeeService.loadEmployeeList(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
            $scope.fillData = function () {
                $scope.employeeList = employeeService.getEmployeeList();
                $scope.hasNextPage = employeeService.hasNextPage();
            };
            //实现模糊查询
            $scope.condition = employeeService.getCondition();
            $scope.viewDetail = function (id) {
                $state.go('market/ep/employee/employee-detail', {dataId: id});
            };

            //加载分公司集团列表
            employeeService.getSubCompany(function (data) {
                $scope.companies = data;
            });

            //高级搜索
            $scope.doSearch = function () {
                $scope.modalQueryMore.hide();
                $scope.reloadData();
            };

            //清空高级搜索条件
            $scope.resetCondition = function () {
                $scope.condition = employeeService.resetCondition();
            };
            //选择性别
            $scope.selectSex = function () {
                $scope.close();
            };
            //选择是否参保
            $scope.selectInsure = function () {
                $scope.close();
            };
        }]);
