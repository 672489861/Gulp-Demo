/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract')
    .factory("SubContractCommonService", ['YTService', 'UserService', function (YT, userService) {
        return {
            queryMerchantList: function (moduleId, callback) {
                var data = {
                    m: moduleId,
                    t: 'v_merchant_list',
                    order: 'id',
                    filter: JSON.stringify([{
                        field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: ''
                    }])
                };
                YT.query({
                    data: data,
                    successCallback: function (result) {
                        if (result.status == 200) {
                            return callback(result.object);
                        } else {
                            return callback([]);
                        }
                    }
                });
            },
            queryTeamList: function (moduleId, callback) {
                var data = {
                    m: moduleId,
                    t: 'v_subcontract_team',
                    order: 'id',
                    filter: JSON.stringify([{
                        field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: ''
                    }])
                };
                YT.query({
                    data: data,
                    successCallback: function (result) {
                        if (result.status == 200) {
                            return callback(result.object);
                        } else {
                            return callback([]);
                        }
                    }
                });
            },
            queryWorkTypeList: function (moduleId, callback) {
                var data = {
                    m: moduleId,
                    t: 'subcontract_d_worktype',
                    order: 'id'
                };
                YT.query({
                    data: data,
                    successCallback: function (result) {
                        if (result.status == 200) {
                            return callback(result.object);
                        } else {
                            return callback([]);
                        }
                    }
                });
            },
            queryContractList: function (moduleId, callback) {
                var data = {
                    m: moduleId,
                    t: 'v_contract_subcontract',
                    order: 'id'
                };
                YT.query({
                    data: data,
                    successCallback: function (result) {
                        if (result.status == 200) {
                            return callback(result.object);
                        } else {
                            return callback([]);
                        }
                    }
                });
            }
        };
    }]);