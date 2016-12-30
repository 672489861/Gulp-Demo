/**
 * Created by zjw on 2016/11/2.
 */
angular.module('app.frame.dashboard')
    .factory("CommonService", ['ContractProjectService', 'SubscribeModuleService', 'MaterialService', 'DeviceService', 'DashBoardSubcontractService',
        function (contractProjectService, subscribeModuleService, materialService, deviceService, subcontractService) {
            return {
                bindScope: function ($scope) {
                    $scope.showOrgListByC = false;
                    $scope.showOrgListByM = false;
                    $scope.showOrgListByD = false;

                    subscribeModuleService.getOrgAndModule();

                    $scope.switchOrgListByC = function () {
                        $scope.showOrgListByC = !$scope.showOrgListByC;
                    };

                    $scope.changeOrgByC = function (orgId) {
                        $scope.showOrgListByC = false;
                        contractProjectService.setOrgId(orgId);
                        $scope.loadDataByC();
                    };

                    $scope.refreshListDataByC = function () {
                        $scope.loadDataByC();
                        $scope.$broadcast("scroll.refreshComplete");
                    };

                    $scope.loadDataByC = function () {
                        var orgIdByC = contractProjectService.getOrgId();

                        var objByC = subscribeModuleService.getObjByC();
                        var orgListByC = subscribeModuleService.getOrgListByC();
                        var orgNameByC = '', moduleListByC = [];
                        if (orgIdByC) {
                            orgNameByC = objByC[orgIdByC].name;
                            moduleListByC = objByC[orgIdByC].moduleListByC;
                        } else {
                            var obj = objByC[orgListByC[0].id];
                            if (obj) {
                                contractProjectService.setOrgId(obj.id);
                                subcontractService.setOrgId(obj.id);
                                orgNameByC = obj.name;
                                moduleListByC = obj.moduleListByC;
                            }
                        }
                        $scope.moduleByC = {
                            orgListByC: orgListByC,
                            orgNameByC: orgNameByC,
                            m60102: moduleListByC[60102] || false,
                            m60103: moduleListByC[60103] || false,
                            m60104: moduleListByC[60104] || false,
                            m60105: moduleListByC[60105] || false,
                            m60106: moduleListByC[60106] || false,
                            m60107: moduleListByC[60107] || false
                        };
                        $scope.fillDataByC();
                    };

                    $scope.fillDataByC = function () {
                        contractProjectService.loadData(function () {
                            $scope.contractInfo = contractProjectService.getContractInfo();
                            $scope.meterAmount = contractProjectService.getSubMeterAmount();
                        });
                        subcontractService.loadPersonCount(function () {
                            $scope.personCount = subcontractService.getPersonCount();
                        });
                        subcontractService.loadSalaryTotal(function () {
                            $scope.salaryTotal = subcontractService.getSalaryTotal();
                        });
                        subcontractService.loadSettlementTotal(function () {
                            $scope.settlementTotal = subcontractService.getSettlementTotal();
                        });
                    };

                    /**
                     * 材料 相关事件和数据加载
                     *
                     */
                    $scope.switchOrgListByM = function () {
                        $scope.showOrgListByM = !$scope.showOrgListByM;
                    };

                    $scope.changeOrgByM = function (orgId) {
                        $scope.showOrgListByM = false;
                        materialService.setOrgId(orgId);
                        $scope.loadDataByM();
                    };

                    $scope.refreshListDataByM = function () {
                        $scope.loadDataByM();
                        $scope.$broadcast("scroll.refreshComplete");
                    };

                    $scope.loadDataByM = function () {
                        var orgIdByM = materialService.getOrgId();

                        var objByM = subscribeModuleService.getObjByM();
                        var orgListByM = subscribeModuleService.getOrgListByM();
                        var orgNameByM = '', moduleListByM = [];
                        if (orgIdByM) {
                            orgNameByM = objByM[orgIdByM].name;
                            moduleListByM = objByM[orgIdByM].moduleListByM;
                        } else {
                            var obj = objByM[orgListByM[0].id];
                            if (obj) {
                                materialService.setOrgId(obj.id);
                                orgNameByM = obj.name;
                                moduleListByM = obj.moduleListByM;
                            }
                        }

                        $scope.moduleByM = {
                            orgListByM: orgListByM,
                            orgNameByM: orgNameByM,
                            m100301: moduleListByM[100301] || false,
                            m100302: moduleListByM[100302] || false,
                            m100303: moduleListByM[100303] || false,
                            m100304: moduleListByM[100304] || false,
                            m100305: moduleListByM[100305] || false,
                            m100306: moduleListByM[100306] || false
                        };

                        materialService.getMaterial(function () {
                            $scope.fillDataByM();
                        });
                    };

                    $scope.fillDataByM = function () {
                        // 采购入库
                        $scope.amount1 = materialService.getAmount1();
                        $scope.balanceAmount1 = materialService.getBalanceAmount1();
                        $scope.list1 = materialService.getList1();

                        // 租赁入库
                        $scope.amount2 = materialService.getAmount2();
                        $scope.balanceAmount2 = materialService.getBalanceAmount2();
                        $scope.list2 = materialService.getList2();

                        // 领用
                        $scope.amount3 = materialService.getAmount3();
                        $scope.list3 = materialService.getList3();

                        // 退库
                        $scope.amount4 = materialService.getAmount4();
                        $scope.list4 = materialService.getList4();

                        // 退货
                        $scope.amount5 = materialService.getAmount5();
                        $scope.list5 = materialService.getList5();

                        // 报损
                        $scope.amount6 = materialService.getAmount6();
                        $scope.list6 = materialService.getList6();
                    };

                    /**
                     * 设备 相关事件和数据加载
                     *
                     */
                    $scope.switchOrgListByD = function () {
                        $scope.showOrgListByD = !$scope.showOrgListByD;
                    };

                    $scope.changeOrgByD = function (orgId) {
                        $scope.showOrgListByD = false;
                        deviceService.setOrgId(orgId);
                        $scope.loadDataByD();
                    };

                    $scope.supplierByRent = [];
                    $scope.supplierByPur = [];
                    $scope.supplierByCom = [];

                    $scope.chooseSupplierByRent = function (n) {
                        $scope.supplierByRent[n] = !$scope.supplierByRent[n];
                    };

                    $scope.chooseSupplierByPur = function (n) {
                        $scope.supplierByPur[n] = !$scope.supplierByPur[n];
                    };

                    $scope.chooseSupplierByCom = function (n) {
                        $scope.supplierByCom[n] = !$scope.supplierByCom[n];
                    };

                    $scope.refreshListDataByD = function () {
                        $scope.loadDataByD();
                        $scope.$broadcast("scroll.refreshComplete");
                    };

                    $scope.loadDataByD = function () {
                        var orgIdByD = deviceService.getOrgId();

                        var objByD = subscribeModuleService.getObjByD();
                        var orgListByD = subscribeModuleService.getOrgListByD();
                        var orgNameByD = '', moduleListByD = [];
                        if (orgIdByD) {
                            orgNameByD = objByD[orgIdByD].name;
                            moduleListByD = objByD[orgIdByD].moduleListByD;
                        } else {
                            var obj = objByD[orgListByD[0].id];
                            if (obj) {
                                deviceService.setOrgId(objByD[orgListByD[0].id].id);
                                orgNameByD = objByD[orgListByD[0].id].name;
                                moduleListByD = objByD[orgListByD[0].id].moduleListByD;
                            }
                        }

                        $scope.moduleByD = {
                            orgListByD: orgListByD,
                            orgNameByD: orgNameByD,
                            m12001: moduleListByD[12001] || false
                        };

                        deviceService.loadData(function () {
                            $scope.fillDataByD();
                        });
                    };

                    $scope.fillDataByD = function () {
                        // 自有设备
                        $scope.ownDLsit = deviceService.getOwnDevice();

                        // 租赁设备
                        $scope.rentDLsit = deviceService.getRentDevice();

                        // 采购设备
                        $scope.purchaseDLsit = deviceService.getPurchaseDevice();

                        // 外单位自带
                        $scope.outCompanyDLsit = deviceService.getOutCompanyDevice();

                    };

                    $scope.loadDataBySubContract = function () {
                        // 加载分包数据
                        var orgId = subcontractService.getOrgId();
                        var objBySubContract = subscribeModuleService.getObjBySubContract();
                        var orgListBySubContract = subscribeModuleService.getOrgListBySubContract();

                        var orgNameBySubContract, moduleListBySubContract;
                        if (orgId) {
                            orgNameBySubContract = objBySubContract[orgId].name;
                            moduleListBySubContract = objBySubContract[orgId].moduleListBySubContract;
                        } else {
                            subcontractService.setOrgId(objBySubContract[orgListBySubContract[0].id].id);
                            orgNameBySubContract = objBySubContract[orgListBySubContract[0].id].name;
                            moduleListBySubContract = objBySubContract[orgListBySubContract[0].id].moduleListBySubContract;
                        }
                        $scope.moduleBySubContract = {
                            orgListBySubContract: orgListBySubContract,
                            orgNameBySubContract: orgNameBySubContract,
                            m13002001: moduleListBySubContract[13002001] || false,
                            m13002003: moduleListBySubContract[13002003] || false,
                            m13003002: moduleListBySubContract[13003002] || false,
                            m13003003: moduleListBySubContract[13003003] || false
                        };

                        $scope.fillDataBySubContract();
                    };

                    $scope.fillDataBySubContract = function () {
                        // 加载顶部数据
                        subcontractService.loadTeamCount(function () {
                            $scope.teamCount = subcontractService.getTeamCount();
                        });
                        subcontractService.loadPersonCount(function () {
                            $scope.personCount = subcontractService.getPersonCount();
                        });
                        subcontractService.loadSalaryTotal(function () {
                            $scope.salaryTotal = subcontractService.getSalaryTotal();
                        });
                        subcontractService.loadSettlementTotal(function () {
                            $scope.settlementTotal = subcontractService.getSettlementTotal();
                        });
                        // 加载具体班组数据
                        subcontractService.loadTeamList(function () {
                            $scope.teamList = subcontractService.getTeamList();
                        });
                    };

                    // 分包下拉刷新
                    $scope.refreshListDataBySubContract = function () {
                        $scope.loadDataBySubContract();
                        $scope.$broadcast("scroll.refreshComplete");
                    };

                    $scope.changeOrgBySubContract = function (orgId, orgName) {
                        $scope.showOrgListByM = false;
                        subcontractService.setOrgId(orgId);
                        $scope.loadDataBySubContract();
                    };

                    // 控制背景显示
                    $scope.switchOrgListBySubContract = function () {
                        $scope.showOrgListByM = !$scope.showOrgListByM;
                    };
                }
            };
        }]);