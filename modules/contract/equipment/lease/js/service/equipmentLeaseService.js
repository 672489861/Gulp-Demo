angular.module('app.contract.equipment.lease')
    .factory("EquipmentLeaseService", ['YTService', 'UserService', function (YT, userService) {
        var serviceData = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition = {
                statusId: -1,
                displayId: "",
                projectName: "",
                rentName: "",
                hireName: "",
                startTime: "",
                endTime: ""
            },
            equipmentInfo = [],
            chargesInfo = [],
            invoiceInfo = [];

        return {
            clearSearchText: function () {
                condition = {
                    statusId: -1,
                    displayId: "",
                    projectName: "",
                    hireName: "",
                    rentName: "",
                    startTime: "",
                    endTime: ""
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
                    m: 6001006,
                    t: 'v_contract_equipmentleasing',
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
                if (condition.hireName != "" && condition.hireName != '请输入租用单位') {
                    filter.push({
                        field: 'hireName',
                        value: '%' + condition.hireName + '%',
                        operator: 'like',
                        relation: 'and'
                    });
                }
                if (condition.rentName != "" && condition.rentName != '请输入出租单位') {
                    filter.push({
                        field: 'rentName',
                        value: '%' + condition.rentName + '%',
                        operator: 'like',
                        relation: 'and'
                    });
                }

                if (condition.startTime != '' && condition.endTime != '') {
                    filter.push([
                        {field: 'beginDate', value: condition.startTime, operator: '>=', relation: 'AND'},
                        {field: 'endDate', value: condition.endTime, operator: '<=', relation: 'AND'}]);
                } else if (condition.startTime != '') {
                    filter.push(
                        {field: 'beginDate', value: condition.startTime, operator: '>=', relation: 'AND'});
                } else if (condition.endTime != '') {
                    filter.push(
                        {field: 'endDate', value: condition.endTime, operator: '<=', relation: 'AND'});
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
                    m: 6001006,
                    t: 'v_contract_equipmentleasing'
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
            queryMaterial: function (id, successCallback) {
                var data = {
                    m: 6001006,
                    t: 'v_contract_equipmentleasing_info'
                };
                var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        equipmentInfo = data.object;
                        successCallback.call(this, data.object);
                    }
                });
            },
            queryCharges: function (id, successCallback) {
                var data = {
                    m: 6001006,
                    t: 'v_contract_equipmentleasing_charges'
                };
                var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        chargesInfo = data.object;
                        successCallback.call(this, data.object);
                    }
                });
            },
            queryInvoice: function (id, successCallback) {
                var data = {
                    m: 6001006,
                    t: 'v_contract_equipmentleasing_taxinvoice'
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
                    m: 6001006,
                    t: 'contract_equipmentleasing_attach'
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
                    projectName: "",
                    hireName: "",
                    rentName: "",
                    startTime: "",
                    endTime: ""
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
            getEquipment: function () {
                return equipmentInfo;
            },
            setEquipment: function (data) {
                equipmentInfo = data;
            },
            getCharges: function () {
                return chargesInfo;
            },
            setCharges: function (data) {
                chargesInfo = data;
            },
            getInvoice: function () {
                return invoiceInfo;
            },
            setInvoice: function (data) {
                invoiceInfo = data;
            }
        };
    }]);
