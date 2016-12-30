/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.contract')
    .factory("ContractListService", ['YTService', 'UserService', function (YT, userService) {
        var contractList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true;
        return {
            getContractList: function () {
                return contractList;
            },
            hasNextPage: function () {
                return hasNextPage;
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
            getSearchData: function () {
                var data = {
                    m: 13003003,
                    t: 'v_subcontract_contract_mobile',
                    order: 'id',
                    page: pageIndex,
                    rows: pageSize
                };
                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },
            getSearchFilter: function () {
                var filter = [];
                filter.push({field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: 'AND'});
                return filter;
            },
            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    contractList.push(pageInfo.items[i]);
                }
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            refreshListData: function (successCallBack) {
                this.clearCachedData();
                this.loadListData(successCallBack);
            },
            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                contractList = [];
            }
        };
    }]);