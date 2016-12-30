/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract.team')
    .factory("TeamListService", ['YTService', 'UserService', function (YT, userService) {
        var teamList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition = {
                merchantId: -1,
                name: "",
                number: "",
                leaderName: ""
            };
        return {
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
                    m: 13002001,
                    t: 'v_subcontract_team_mobile',
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
                    teamList.push(pageInfo.items[i]);
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
                if (condition.name != "") {
                    filter.push({field: 'name', value: "%" + condition.name + "%", operator: 'like', relation: 'AND'});
                }
                if (condition.number != "") {
                    filter.push({
                        field: 'number',
                        value: "%" + condition.number + "%",
                        operator: 'like',
                        relation: 'AND'
                    });
                }
                if (condition.leaderName != "") {
                    filter.push({
                        field: 'leaderName',
                        value: "%" + condition.leaderName + "%",
                        operator: 'like',
                        relation: 'AND'
                    });
                }
                return filter;
            },
            refreshListData: function (successCallBack) {
                this.clearCachedData();
                this.loadListData(successCallBack);
            },
            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                teamList = [];
            },
            getTeamList: function () {
                return teamList;
            },
            hasNextPage: function () {
                return hasNextPage;
            },
            getCondition: function () {
                return condition;
            },
            resetCondition: function () {
                condition = {
                    merchantId: -1,
                    name: "",
                    number: "",
                    leaderName: ""
                };
            }
        };
    }]);
