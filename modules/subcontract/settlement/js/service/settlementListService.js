/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.settlement')
    .factory("SettlementListService", ['YTService', 'UserService', function (YT, userService) {
        var settlementList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true, total = 0,
            condition = {
                merchantId: -1,
                contractId: -1,
                settlementTimeBegin: "",
                settlementTimeEnd: "",
                merchantName: "不限"
            };
        return {
            getSettlementList: function () {
                return settlementList;
            },
            hasNextPage: function () {
                return hasNextPage;
            },
            getCondition: function () {
                return condition;
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
            refreshListData: function (successCallBack) {
                this.clearCachedData();
                this.loadListData(successCallBack);
            },
            getSearchData: function () {
                var data = {
                    m: 13003003,
                    t: 'v_subcontract_settlement',
                    order: 'id',
                    page: pageIndex,
                    rows: pageSize
                };
                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },
            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    var settlement = pageInfo.items[i];
                    total = (parseFloat(total) + parseFloat(settlement.subcontractCumulativeAmount)).toFixed(2);
                    settlementList.push(settlement);
                }
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            getSearchFilter: function () {
                var filter = [];
                filter.push({field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: 'AND'});
                if (condition.merchantId != -1) {
                    filter.push({field: 'merchantId', value: condition.merchantId, operator: '=', relation: 'AND'});
                }
                if (condition.contractId != -1) {
                    filter.push({field: 'contractId', value: condition.contractId, operator: '=', relation: 'AND'});
                }

                if (condition.settlementTimeBegin != '' && condition.settlementTimeEnd != '') {
                    filter.push([
                        {
                            field: 'settlementDate',
                            value: condition.settlementTimeBegin,
                            operator: '>=',
                            relation: 'AND'
                        },
                        {
                            field: 'settlementDate',
                            value: condition.settlementTimeEnd,
                            operator: '<=',
                            relation: 'AND'
                        }]);
                } else if (condition.settlementTimeBegin != '') {
                    filter.push(
                        {
                            field: 'settlementDate',
                            value: condition.settlementTimeBegin,
                            operator: '>=',
                            relation: 'AND'
                        });
                } else if (condition.settlementTimeEnd != '') {
                    filter.push(
                        {field: 'settlementDate', value: condition.settlementTimeEnd, operator: '<=', relation: 'AND'});
                }

                return filter;
            },
            clearCachedData: function () {
                pageIndex = 0;
                total = 0;
                hasNextPage = true;
                settlementList = [];
            },
            resetCondition: function () {
                condition = {
                    merchantId: -1,
                    contractId: -1,
                    settlementTimeBegin: "",
                    settlementTimeEnd: "",
                    merchantName: "不限"
                };
            },
            getTotal: function () {
                return total;
            }
        };
    }]);
