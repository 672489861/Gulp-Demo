angular.module('app.frame.dashboard')
    .factory("ContractService", ['YTService', 'UserService', function (YT, userService) {
        var yearList = [],
            nowYear = new Date().getFullYear(),
            cellName = '';

        return {
            getNowYear: function () {
                return nowYear;
            },
            getYearList: function () {
                yearList.length = 0;
                for (var i = 2013; i <= new Date().getFullYear(); i++) {
                    yearList.push({
                        year: i
                    });
                }
                return yearList.reverse();
            },
            getBasisData: function (callback) {
                var params = {
                    t: 'v_dashboard_contract_summary',
                    order: 'groupId asc'
                };
                this.ajax(params, function (data) {
                    callback(data[0]);
                });
            },
            getContractList: function (statisticType, year, callback) {
                var self = this;
                nowYear = year;

                self.getBasisData(function (basis) {
                    switch (statisticType) {
                        case '1':
                            // 按分公司统计
                            self.getContractByOrg(function (data) {
                                cellName = '公司名称';
                                callback(cellName, basis, data);
                            });
                            break;
                        case '2':
                            // 按地域统计
                            self.getContractByArea(function (data) {
                                cellName = '地域名称';
                                callback(cellName, basis, data);
                            });
                            break;
                        case '3':
                            // 按工程类型统计-房屋建筑工程
                            self.getContractByWorkCategory(1, function (data) {
                                cellName = '房屋建筑工程';
                                callback(cellName, basis, data);
                            });
                            break;
                        case '4':
                            // 按工程类型统计-交通运输工程
                            self.getContractByWorkCategory(2, function (data) {
                                cellName = '交通运输工程';
                                callback(cellName, basis, data);
                            });
                            break;
                        case '5':
                            // 按承包类型

                            break;
                        case '6':
                            // 按合同状态

                            break;
                    }
                });
            },
            getContractByOrg: function (callback) {
                var params = {
                    t: 'v_dashboard_contract_org',
                    order: 'orgId asc'
                };

                this.ajax(params, function (data) {
                    var contractList = [];
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        contractList.push({
                            name: obj.orgName,
                            amount: obj.newSignAmount,
                            ratio: obj.ratio,
                            reportAmount: obj.reportAmount
                        });
                    }
                    callback(contractList);
                });
            },
            getContractByArea: function (callback) {
                var params = {
                    t: 'v_dashboard_contract_area',
                    order: 'provinceId asc'
                };

                this.ajax(params, function (data) {
                    var contractList = [];
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        contractList.push({
                            name: obj.provinceName,
                            amount: obj.amount,
                            ratio: obj.ratio
                        });
                    }
                    callback(contractList);
                });
            },
            getContractByWorkCategory: function (workCategoryId, callback) {
                var params = {
                    filter: {field: 'WorkCategoryId', value: workCategoryId, operator: '=', relation: 'AND'},
                    t: 'v_dashboard_contract_workcategory',
                    order: 'subWorkCategoryId asc'
                };

                this.ajax(params, function (data) {
                    var contractList = [];
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        contractList.push({
                            name: obj.subWorkCategoryName,
                            amount: obj.amount,
                            ratio: obj.ratio
                        });
                    }
                    callback(contractList);
                });
            },
            ajax: function (params, callback) {
                var filter = [
                    {field: 'groupId', value: userService.getRootOrgId(), operator: '=', relation: 'AND'},
                    {field: 'year', value: nowYear, operator: '=', relation: 'AND'}
                ];

                if (params.filter != undefined) {
                    filter.push(params.filter);
                }

                var data = {
                    m: 1005,
                    t: params.t,
                    filter: JSON.stringify(filter),
                    order: params.order
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            callback(data.object);
                        }
                    }
                });
            }
        };
    }]);
