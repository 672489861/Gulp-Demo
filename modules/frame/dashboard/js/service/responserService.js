angular.module('app.frame.dashboard')
    .factory("ResponserService", ['YTService', 'UserService', 'ContractService', function (YT, userService, ContractService) {
        var nowYear = new Date().getFullYear();

        return {
            getResponserList: function (statisticType, year, callback) {
                var self = this;
                nowYear = year;

                ContractService.getBasisData(function (basis) {
                    switch (statisticType) {
                        case '1':
                            // 按分公司统计
                            var params = {
                                t: 'v_org_responser_orginfo',
                                param: {year: nowYear, groupId: userService.getRootOrgId()}
                            };
                            self.ajax(params, function (data) {
                                callback(basis, data);
                            });
                            break;
                        case '2':
                            // 内部经营协议签订情况
                            var params = {
                                t: 'v_org_responser_operation_org_year',
                                filter: [
                                    {
                                        field: 'groupId',
                                        value: userService.getRootOrgId(),
                                        operator: '=',
                                        relation: 'AND'
                                    },
                                    {field: 'year', value: nowYear, operator: '=', relation: 'AND'}
                                ]
                            };
                            self.ajax(params, function (data) {
                                callback(basis, data);
                            });
                            break;
                    }
                });
            },
            ajax: function (params, callback) {
                var data = {
                    m: 1005,
                    t: params.t
                };

                if (params.filter) {
                    data.filter = JSON.stringify([params.filter]);
                }

                if (params.param) {
                    data.params = JSON.stringify(params.param);
                }

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            data.object.splice(0, 1);
                            callback(data.object);
                        }
                    }
                });
            }
        };
    }]);