/**
 * Created by zjw on 2016/9/10.
 */
angular.module('app.subcontract.salary')
    .factory("SalaryListService", ['YTService', 'UserService', 'env', function (YT, userService, env) {
        var salaryList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            total = 0,
            condition = {
                teamId: -1,
                personName: "",
                telphone: "",
                idcard: "",
                nativeplace: "",
                age: "",
                worktypeId: -1,
                worktypeName: "不限",
                calcTypeId: -1,// 计取方式
                calcTypeName: "不限"
            };
        return {
            getSalaryList: function () {
                return salaryList;
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
                    m: 13002003,
                    t: 'v_subcontract_person_salarystatistics_personal_month',
                    order: 'teamId,personId',
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

                if (condition.teamId != -1) {
                    filter.push({field: 'teamId', value: condition.teamId, operator: '=', relation: 'AND'});
                }
                if (condition.personName != "") {
                    filter.push({field: 'personName', value: '%' + condition.personName + '%', operator: 'like', relation: 'AND'});
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
                if (condition.calcTypeId != -1) {
                    filter.push({field: 'calculationId', value: condition.calcTypeId, operator: '=', relation: 'AND'});
                }
                return filter;
            },
            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                var ticket = userService.getTicket();
                for (var i = 0; i < pageInfo.items.length; i++) {
                    var person = pageInfo.items[i];
                    if (person.photourl != null && person.photourl != "") {
                        person.photourl = person.photourl.replace("\\", "/");
                        person.photourl = env.server + "/download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + person.photourl;
                    } else {
                        person.photourl = "modules/subcontract/person/img/photo.png";
                    }
                    person.nowMonthSalary = this.getMonthData(person);
                    total = (parseFloat(total) + parseFloat(person.nowMonthSalary)).toFixed(2);
                    salaryList.push(person);
                }
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            resetCondition: function () {
                condition = {
                    teamId: -1,
                    personName: "",
                    telphone: "",
                    idcard: "",
                    nativeplace: "",
                    age: "",
                    worktypeId: -1,
                    worktypeName: "不限",
                    calcTypeName: "不限",
                    calcTypeId: -1 // 计取方式
                };
            },
            clearCachedData: function () {
                total = 0;
                pageIndex = 0;
                hasNextPage = true;
                salaryList = [];
            },
            getMonthData: function (data) {
                var month = new Date().getMonth() + 1;
                switch (month) {
                    case 1:
                        return data.Jan;
                        break;
                    case 2:
                        return data.Feb;
                        break;
                    case 3:
                        return data.Mar;
                        break;
                    case 4:
                        return data.Apr;
                        break;
                    case 5:
                        return data.May;
                        break;
                    case 6:
                        return data.Jun;
                        break;
                    case 7:
                        return data.Jul;
                        break;
                    case 8:
                        return data.Aug;
                        break;
                    case 9:
                        return data.Sept;
                        break;
                    case 10:
                        return data.Oct;
                        break;
                    case 11:
                        return data.Nov;
                        break;
                    default:
                        return data.Dec;
                        break;
                }
            },
            getTotal: function () {
                return total;
            }
        };
    }]);