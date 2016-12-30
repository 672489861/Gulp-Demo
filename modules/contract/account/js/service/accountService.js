angular.module('app.contract.account')
    .factory("AccountService", ['YTService', 'UserService', function (YT, userService) {
        var serviceData = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition = {
                searchText: ''
            },
            nowYear, nowMonth,
            typeId = userService.getTypeId(),
            orgId = userService.getRootOrgId();

        return {
            getModule: function () {
                var module = 6003001001;
                if (YT.haveRight(6003001004)) {
                    module = 6003001004;
                    return module;
                }
                if (YT.haveRight(6003001003)) {
                    module = 6003001003;
                    return module;
                }
                if (YT.haveRight(6003001002)) {
                    module = 6003001002;
                    return module;
                }
                if (YT.haveRight(6003001001)) {
                    module = 6003001001;
                    return module;
                }
            },
            getSysParam: function (callback) {
                var self = this;
                YT.getOwnerGroupId(function (data) {
                    var filter = [
                        {field: 'name', value: 'contract-report-begin-time', operator: '=', relation: 'AND'},
                        {field: 'orgId', value: data, operator: '=', relation: 'AND'}
                    ];

                    var data = {
                        m: self.getModule(),
                        t: 'sys_param',
                        filter: JSON.stringify(filter)
                    };

                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            if (200 == data.status) {
                                var now = new Date();
                                var nowYear = now.getFullYear();
                                var nowMonth = now.getMonth() + 1;
                                var day = now.getDate();
                                // 判断是否小于 产值上报开始时间  小于则上报上月的台账记录
                                if (day <= data.object[0].reportTime) {
                                    // 上报上月的台账记录，判断是否已上报，上报过则带出数据
                                    if (nowMonth == 1) {
                                        nowYear = nowYear - 1;
                                    }
                                    nowMonth = nowMonth - 1;
                                }
                                callback({nowYear: nowYear, nowMonth: nowMonth});
                            }
                        }
                    });
                });
            },
            getAccount: function (id, callback) {
                var filter = [], field = 'orgId';

                if (id) {
                    filter.push({field: 'contractId', value: id, operator: '=', relation: 'AND'});
                }
                if (typeId == 1) {
                    field = 'groupId';
                }
                filter.push(
                    {field: field, value: orgId, operator: '=', relation: 'AND'},
                    {field: 'year', value: nowYear, operator: '=', relation: 'AND'},
                    {field: 'month', value: nowMonth, operator: '=', relation: 'AND'}
                );

                var data = {
                    m: this.getModule(),
                    t: 'v_contract_account',
                    filter: JSON.stringify(filter),
                    params: JSON.stringify({year: nowYear, month: nowMonth})
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            var items = data.object, list = [];
                            for (var i = 0; i < items.length; i++) {
                                list[items[i].contractId] = items[i];
                            }
                            callback(list);
                        }
                    }
                });
            },
            setAccountList: function (id, contractList, callback) {
                var self = this;
                self.getSysParam(function (data) {
                    nowYear = data.nowYear;
                    nowMonth = data.nowMonth;
                    self.getAccount(id, function (data) {
                        for (var i = 0; i < contractList.length; i++) {
                            var obj = data[contractList[i].id];
                            if(obj != undefined){
                                contractList[i].monthReportAmount = obj.monthReportAmount;
                                contractList[i].monthContractReport = obj.monthContractReport;
                                contractList[i].agoContractReport = obj.agoContractReport;
                            }
                        }
                        callback(contractList);
                    });
                });
            },
            loadListData: function (successCallback) {
                ++pageIndex;
                var self = this;
                YT.query({
                    data: self.getSearchData(),
                    successCallback: function (data) {
                        var items = data.object.items;
                        var contractList = data;
                        self.setAccountList(null, items, function (data) {
                            contractList.object.items = data;
                            self.loadListDataCallback(contractList);
                            successCallback.call();
                        });
                    }
                });
            },
            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    serviceData.push(pageInfo.items[i]);
                }
                // pageInfo.pageCount确定页数
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            //刷新
            refreshListData: function (successCallBack) {
                this.clearCachedData();
                this.loadListData(successCallBack);
            },
            clearCachedData: function () {
                condition.searchText = '';
                pageIndex = 0;
                hasNextPage = true;
                serviceData = [];
            },
            getSearchData: function () {
                var data = {
                    m: this.getModule(),
                    t: 'v_contract_primary_processing',
                    order: 'reviewTime desc, submitTime desc',
                    page: pageIndex,
                    rows: pageSize
                };
                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },
            getSearchFilter: function () {
                var filter = [], field = 'orgId';

                if (typeId == 1) {
                    field = 'groupId';
                }
                filter.push({field: field, value: orgId, operator: '=', relation: 'AND'});
                return filter;
            },
            queryDetail: function (id, successCallback) {
                var self = this;

                var filter = [
                    {field: 'id', value: id, operator: '=', relation: 'and'}
                ];

                var data = {
                    m: this.getModule(),
                    t: 'v_contract_primary_processing',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        self.setAccountList(id, data.object, function (data) {
                            successCallback.call(this, data[0]);
                        });
                    }
                });
            },
            queryReport: function (id, successCallback) {
                var filter = [
                    {field: 'contractId', value: id, operator: '=', relation: 'and'}
                ];

                var data = {
                    m: this.getModule(),
                    t: 'contract_account_report_detail',
                    filter: JSON.stringify(filter),
                    order: 'year desc, month desc'
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        var items = data.object, list = [], report = {};
                        for (var i = 0; i < items.length; i++) {
                            var obj = items[i];
                            if (i == 0) {
                                report = {};
                                report.year = obj.year;
                                report.amount = obj.amount;
                                report.list = [];
                                list.push(report);
                            } else {
                                var oldObj = items[i - 1];

                                if (obj.year != oldObj.year) {
                                    report = {};
                                    report.year = obj.year;
                                    report.amount = obj.amount;
                                    report.list = [];
                                    list.push(report);
                                } else {
                                    report.amount += obj.amount;
                                }
                            }
                            list[list.length - 1].list.push(obj);
                        }
                        successCallback.call(this, list);
                    }
                });
            },
            getCondition: function () {
                return condition;
            },
            getServiceData: function () {
                return serviceData;
            },
            hasNextPage: function () {
                return hasNextPage;
            }
        };
    }]);
