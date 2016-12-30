/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.merchant')
    .factory("MerchantListService", ['YTService', 'UserService', function (YT, userService) {
        var merchantList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true;
        return {
            getMerchantList: function () {
                return merchantList;
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
            refreshListData: function (successCallBack) {
                this.clearCachedData();
                this.loadListData(successCallBack);
            },
            getSearchData: function () {
                var data = {
                    m: 13003002,
                    t: 'v_subcontract_merchant_mobile',
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
                    merchantList.push(pageInfo.items[i]);
                }
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                merchantList = [];
            }
        };
    }]);
