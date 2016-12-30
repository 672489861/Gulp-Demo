angular.module('app.contract.other')
    .factory("OtherService", ['YTService', 'UserService', '$ionicPopup', function (YT, userService, $ionicPopup) {
        var serviceData = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition = {
                statusId: -1,
                displayId: "",
                firstPartyName: "",
                secondPartyName: "",
                projectName: ""
            },
            otherInfo = [],
            invoiceInfo = [];

        return {
            clearSearchText: function () {
                condition = {
                    statusId: -1,
                    displayId: "",
                    firstPartyName: "",
                    secondPartyName: "",
                    projectName: ""
                };
            },
            loadListData: function (successCallback) {
                ++pageIndex;
                var self = this;
                YT.query({
                    data: self.getSearchData(),
                    successCallback: function (data) {
                        self.loadListDataCallback(data);
                        successCallback.call();
                    }
                });
            },

            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    serviceData.push(pageInfo.items[i]);
                }
                //pageInfo.pageCount确定页数
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
                pageIndex = 0;
                hasNextPage = true;
                serviceData = [];
            },

            getSearchData: function () {
                var data = {
                    m: 6001007,
                    t: 'v_contract_othercontract',
                    order: 'id desc',
                    page: pageIndex,
                    rows: pageSize
                };
                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },

            getSearchFilter: function () {
                var typeId = userService.getTypeId();
                var rootId = userService.getRootOrgId();
                var filter = [];
                if (condition.statusId != -1) {
                    filter.push({field: 'statusId', value: condition.statusId, operator: '=', relation: 'AND'});
                }
                if (condition.displayId != "" && condition.displayId != '请输入合同编号') {
                    filter.push({
                        field: 'displayId',
                        value: '%' + condition.displayId + '%',
                        operator: 'like',
                        relation: 'and'
                    });
                }
                if (condition.projectName != "" && condition.projectName != '请输入工程名称') {
                    filter.push({
                        field: 'projectName',
                        value: '%' + condition.projectName + '%',
                        operator: 'like',
                        relation: 'and'
                    });
                }
                if (condition.firstPartyName != "" && condition.firstPartyName != '请输入甲方') {
                    filter.push({
                        field: 'firstPartyName',
                        value: '%' + condition.firstPartyName + '%',
                        operator: 'like',
                        relation: 'and'
                    });
                }
                if (condition.secondPartyName != "" && condition.secondPartyName != '请输入乙方') {
                    filter.push({
                        field: 'secondPartyName',
                        value: '%' + condition.secondPartyName + '%',
                        operator: 'like',
                        relation: 'and'
                    });
                }
                filter.push({field: 'statusId', value: 2, operator: '<>', relation: 'And'});
                if (typeId == 1) {
                    filter.push({field: 'groupId', value: rootId, operator: '=', relation: ''});
                } else if (typeId == 2) {
                    filter.push({field: 'companyId', value: rootId, operator: '=', relation: ''});
                } else if (typeId == 3) {
                    filter.push({field: 'orgId', value: rootId, operator: '=', relation: ''});
                }
                return filter;
            },

            queryDetail: function (id, successCallback) {
                var data = {
                    m: 6001007,
                    t: 'v_contract_othercontract'
                };
                var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback.call(this, data.object[0]);
                    }
                });
            },

            queryInvoice: function (id, successCallback) {
                var data = {
                    m: 6001007,
                    t: 'v_contract_othercontract_taxinvoice'
                };
                var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        invoiceInfo = data.object;
                        successCallback.call(this, data.object);
                    }
                });
            },

            queryAttach: function (id, successCallback) {
                var data = {
                    m: 6001007,
                    t: 'contract_othercontract_attach'
                };
                var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback.call(this, data.object);
                    }
                });
            },

            downloadAttach: function (attach) {
                YT.download(attach);
            },

            resetCondition: function () {
                condition = {
                    statusId: -1,
                    displayId: "",
                    firstPartyName: "",
                    secondPartyName: "",
                    projectName: ""
                };
            },

            getServiceData: function () {
                return serviceData;
            },

            hasNextPage: function () {
                return hasNextPage;
            },

            getCondition: function () {
                return condition;
            },

            getInvoice: function () {
                return invoiceInfo;
            },
            setInvoice: function (data) {
                invoiceInfo = data;
            }
        };
    }]);
