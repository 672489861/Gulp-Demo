angular.module('app.contract.primary')
    .factory("PrimaryService", ['YTService', 'UserService','$state', function (YT, userService,$state) {
        var primaryList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition = {
                //合同类型
                typeId: -1,
                displayId: "",
                projectName: "",
                psid: -1,
                merchantName: "",
                wcid: -1,
                responsiblePersonName: "",
                manager: "",
                signTime: "",
                startTime: "",
                endTime: ""
            };

        return {
            clearSearchText: function () {
                condition = {
                    typeId: -1,
                    displayId: "",
                    projectName: "",
                    psid: -1,
                    merchantName: "",
                    wcid: -1,
                    responsiblePersonName: "",
                    manager: "",
                    signTime: "",
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
                        //successCallback();
                        successCallback.call();
                    }
                });
            },

            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    primaryList.push(pageInfo.items[i]);
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
                primaryList = [];
            },

            getSearchData: function () {
                var data = {
                    m: 6001001003,
                    t: 'v_contract_primary_processing',
                    order: 'submitTime desc',
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
                var userId = userService.getUserId();
                //集团过滤
                var filter = [];
                if (typeId == 1) {
                    filter.push(
                        {field: 'groupId', value: rootId, operator: '=', relation: 'AND'},
                        {field: 'projectStatusId', value: 1, operator: '=', relation: 'AND'}
                    );
                }
                //针对分公司的登入人员
                if (!YT.haveRight(6001001002) && typeId == 2) {
                    filter.push(
                        [
                            {field: 'submitUserId', value: userId, operator: '=', relation: 'or'},
                            {field: 'responsiblePersonId', value: userId, operator: '=', relation: 'and'}
                        ]);
                } else if (YT.haveRight(6001001002) && typeId == 2) {
                    filter.push({field: 'orgId', value: rootId, operator: '=', relation: 'AND'});
                }

                if (condition.typeId != -1) {
                    filter.push({field: 'typeId', value: condition.typeId, operator: '=', relation: 'AND'});
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
                if (condition.psid != -1) {
                    filter.push({field: 'projectStatusId', value: condition.psid, operator: '=', relation: 'AND'});
                }
                if (condition.wcid != -1) {
                    filter.push({field: 'workCategoryId', value: condition.wcid, operator: '=', relation: 'AND'});
                }
                if (condition.merchantName != "" && condition.merchantName != '请输入发包人') {
                    filter.push({field: 'merchantName', value: condition.typeId, operator: '=', relation: 'AND'});
                }
                if (condition.responsiblePersonName != "" && condition.merchantName != '请输入责任人') {
                    filter.push({
                        field: 'responsiblePersonName',
                        value: condition.responsiblePersonName,
                        operator: '=',
                        relation: 'AND'
                    });
                }
                if (condition.manager != "" && condition.manager != '请输入项目经理') {
                    filter.push({field: 'manager', value: condition.manager, operator: '=', relation: 'AND'});
                }
                //时间过滤
                if (condition.signTime != "") {
                    filter.push({field: 'signDate', value: condition.signTime, operator: '>=', relation: 'AND'});
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
                return filter;
            },
            getProjectContractId: function (callback) {
                var data = {
                    m: 6001001003,
                    t: 'v_org_org_extend',
                    filter: JSON.stringify([{
                        field: 'id',
                        value: userService.getRootOrgId(),
                        operator: '=',
                        relation: 'and'
                    }])
                };
                YT.query({
                    data: data,
                    successCallback: function (result) {
                        callback(result.object[0].contractId);
                    }
                })
            },
            getPrimaryDetail: function (id, successCallback) {
                var data = {
                    m: 6001001003,
                    t: 'v_contract_primary'
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
            goContractDetail: function () {
                var self = this;
                if (userService.getTypeId() == 3) {
                    self.getProjectContractId(function (id) {
                        $state.go('contract/primary/primary-detail', {id: id});
                    })
                } else {
                    $state.go('contract/primary/primary-list');
                }
            },
            queryPrimaryAttach: function (id, successCallback) {
                var attachData = {
                    m: 6001001003,
                    t: 'contract_primary_attach'
                };
                var attachFilter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                attachData.filter = JSON.stringify(attachFilter);
                YT.query({
                    data: attachData,
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
                    typeId: -1,
                    displayId: "",
                    projectName: "",
                    psid: -1,
                    merchantName: "",
                    wcid: -1,
                    responsiblePersonName: "",
                    manager: "",
                    signTime: "",
                    startTime: "",
                    endTime: ""
                };
            },

            getPrimaryList: function () {
                return primaryList;
            },

            hasNextPage: function () {
                return hasNextPage;
            },

            getCondition: function () {
                return condition;
            },
            getTypeId: function () {
                return userService.getTypeId();
            }
        };
    }]);
