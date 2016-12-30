/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract.person')
    .factory("PersonListService", ['YTService', 'UserService', 'env', function (YT, userService, env) {
        var personList = [],
            pageIndex = 0,
            pageSize = 10,
            recordCount = 0,
            hasNextPage = true,
            condition = {
                merchantId: -1,
                name: "",
                telphone: "",
                idcard: "",
                nativeplace: "",
                age: "",
                worktypeId: -1,
                special: -1,
                id: -1,   // 班组编号
                inTimeBegin: "",
                inTimeEnd: "",
                outTimeBegin: "",
                outTimeEnd: "",
                workTypeName: "全部",
                teamName: "全部",
                isspecial: "不限"
            };
        return {
            getPersonList: function () {
                return personList;
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
                    m: 13002001,
                    t: 'v_subcontract_person',
                    order: 'id,personId',
                    page: pageIndex,
                    rows: pageSize
                };
                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },
            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                recordCount = data.object.recordCount;
                var ticket = userService.getTicket();
                for (var i = 0; i < pageInfo.items.length; i++) {
                    var person = pageInfo.items[i];
                    if (person.photourl != null && person.photourl != "") {
                        person.photourl = person.photourl.replace("\\", "/");
                        person.photourl = env.server + "/download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + person.photourl;
                    } else {
                        person.photourl = "modules/subcontract/person/img/photo.png";
                    }
                    personList.push(person);
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
                    filter.push({field: 'name', value: '%' + condition.name + '%', operator: 'like', relation: 'AND'});
                }
                if (condition.nativeplace != "") {
                    filter.push({
                        field: 'nativeplace',
                        value: '%' + condition.nativeplace + '%',
                        operator: 'like',
                        relation: 'AND'
                    });
                }
                if (condition.telphone != "") {
                    filter.push({
                        field: 'telphone',
                        value: '%' + condition.telphone + '%',
                        operator: 'like',
                        relation: 'AND'
                    });
                }
                if (condition.idcard != "") {
                    filter.push({
                        field: 'idcard',
                        value: '%' + condition.idcard + '%',
                        operator: 'like',
                        relation: 'AND'
                    });
                }
                if (condition.age != "") {
                    filter.push({field: 'age', value: condition.age, operator: '=', relation: 'AND'});
                }
                if (condition.worktypeId != -1) {
                    filter.push({field: 'worktypeId', value: condition.worktypeId, operator: '=', relation: 'AND'});
                }
                if (condition.special != -1) {
                    filter.push({field: 'special', value: condition.special, operator: '=', relation: 'AND'});
                }
                if (condition.id != -1) {
                    filter.push({field: 'id', value: condition.id, operator: '=', relation: 'AND'});
                }
                if (condition.inTimeBegin != '' && condition.inTimeEnd != '') {
                    filter.push([
                        {field: 'inTime', value: condition.inTimeBegin, operator: '>=', relation: 'AND'},
                        {field: 'inTime', value: condition.inTimeEnd, operator: '<=', relation: 'AND'}]);
                } else if (condition.inTimeBegin != '') {
                    filter.push(
                        {field: 'inTime', value: condition.inTimeBegin, operator: '>=', relation: 'AND'});
                } else if (condition.inTimeEnd != '') {
                    filter.push(
                        {field: 'inTime', value: condition.inTimeEnd, operator: '<=', relation: 'AND'});
                }
                if (condition.outTimeBegin != '' && condition.outTimeEnd != '') {
                    filter.push([
                        {field: 'outTime', value: condition.outTimeBegin, operator: '>=', relation: 'AND'},
                        {field: 'outTime', value: condition.outTimeEnd, operator: '<=', relation: 'AND'}]);
                } else if (condition.outTimeBegin != '') {
                    filter.push(
                        {field: 'outTime', value: condition.outTimeBegin, operator: '>=', relation: 'AND'});
                } else if (condition.inTimeEnd != '') {
                    filter.push(
                        {field: 'outTime', value: condition.outTimeEnd, operator: '<=', relation: 'AND'});
                }
                return filter;
            },
            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                personList = [];
            },
            resetCondition: function () {
                condition = {
                    merchantId: -1,
                    name: "",
                    telphone: "",
                    idcard: "",
                    nativeplace: "",
                    age: "",
                    worktypeId: -1,
                    special: -1,
                    id: -1,   // 班组编号
                    inTimeBegin: "",
                    inTimeEnd: "",
                    outTimeBegin: "",
                    outTimeEnd: "",
                    workTypeName: "全部",
                    teamName: "全部",
                    isspecial: "不限"
                };
            },
            getRecordCount: function () {
                return recordCount;
            }
        };
    }]);