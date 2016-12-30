/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.measure')
    .factory("MeasureListService", ['YTService', 'UserService', function (YT, userService) {
        var measureList = [],
            pageIndex = 0,
            pageSize = 10,
            total = 0,
            hasNextPage = true;
        return {
            getMeasureList: function () {
                return measureList;
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
                    t: 'v_subcontract_measure_statistics_time_mobile',
                    order: 'year desc,month desc',
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
                    total = (parseFloat(total) + parseFloat(pageInfo.items[i].amount)).toFixed(2);
                    measureList.push(pageInfo.items[i]);
                }
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            clearCachedData: function () {
                pageIndex = 0;
                total = 0;
                hasNextPage = true;
                measureList = [];
            },
            getTotal: function () {
                return total;
            }
        };
    }]);