angular.module('app.frame.dashboard')
    .factory("ContractProjectService", ['YTService', 'UserService', 'MaterialService', function (YT, userService) {

        var orgId = 0, contractInfo = [], subMeterAmount = 0;

        return {
            loadData: function (callback) {
                var self = this;

                contractInfo.length = 0;
                subMeterAmount = 0;

                self.setContractInfo(function () {
                    self.setSubMeterAmount(function () {
                        callback.call();
                    });
                });
            },
            setContractInfo: function (callback) {
                var filter = [
                    {field: 'projectId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: 1005,
                    t: 'v_dashboard_contract_info',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            contractInfo = data.object;
                            callback();
                        }
                    }
                });
            },
            setSubMeterAmount: function (callback) {
                var filter = [
                    {field: 'orgId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: 1005,
                    t: 'v_dashboard_subcontract_measure',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            subMeterAmount = data.object[0].amount;
                            callback();
                        }
                    }
                });
            },
            getContractInfo: function () {
                return contractInfo;
            },
            getSubMeterAmount: function () {
                return subMeterAmount;
            },
            getOrgId: function () {
                return orgId;
            },
            setOrgId: function (val) {
                orgId = val;
            }
        }
    }]);