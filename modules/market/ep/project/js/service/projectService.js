angular.module('app.market.ep.project')
    .factory('ProjectService', ['YTService', 'UserService', function (YT, userService) {
        var projectList = [],
            pageIndex = 0,
            pageSize = 10,
            condition = {
                org: {orgId: 0, orgName: '不限'},
                provinces: [],
                cities: [],
                contractMode: {Aid: 0, name: '不限', Bid: 0, AName: ''},
                buildingType: {Aid: 0, name: '不限', Bid: 0, Cid: 0, AName: '', BName: ''},
                structuralForm: {Aid: 0, name: '不限', Bid: 0, AName: ''},
                amount: {max: null, min: null},
                manager: {id: 0, name: '不限'},
                director: {id: 0, name: '不限'},
                isCompleted: -1,
                fundingSources: {id: 0, name: '不限'},
                property: {id: 0, name: '不限'},
                startTime: {max: '', min: ''},
                endTime: {max: '', min: ''},
                managerText: '',
                directorText: '',
                provinceText: '不限'
            },
            hasNextPage = true;
        return {
            loadProjectList: function (successCallBack) {
                ++pageIndex;
                var self = this;
                self.getSearchData(function (data1) {
                    YT.query({
                        data: data1,
                        successCallback: function (data) {
                            self.loadProjectListCallBack(data);
                            successCallBack();
                        }
                    });
                })
            },
            getSearchData: function (callback) {
                var self = this;
                self.getTopOrgId(function (id) {
                    var filter = [{field: 'topOrgId', value: id, operator: '=', relation: 'and'}];
                    filter = self.getSearchFilter(filter);
                    var data = {
                        m: 5001002,
                        t: 'v_market_ep_project',
                        order: 'id desc',
                        page: pageIndex,
                        rows: pageSize,
                        filter: JSON.stringify(filter)
                    };
                    callback(data);
                });
            },
            getTopOrgId: function (callback) {
                var typeId = userService.getTypeId();
                var rootId = userService.getRootOrgId();
                if (typeId == 1) {
                    callback(rootId - 1)
                } else if (typeId == 2) {
                    YT.query({
                        data: {
                            m: 5001002,
                            t: "org_org",
                            filter: JSON.stringify([{field: 'id', operator: '=', value: rootId, relation: ''}])
                        },
                        successCallback: function (data) {
                            callback(data.object[0].pid);
                        }
                    })
                }
            },
            getProjectList: function () {
                return projectList;
            },
            getCondition: function () {
                return condition;
            },
            getSearchFilter: function (filter) {
                if (condition.org.orgId > 0) {
                    filter.push({field: 'orgId', value: condition.org.orgId, operator: '=', relation: 'and'})
                }
                if (condition.amount.max) {
                    filter.push({field: 'contractamount', value: condition.amount.max, operator: '<=', relation: 'and'})
                }
                if (condition.amount.min) {
                    filter.push({field: 'contractamount', value: condition.amount.min, operator: '>=', relation: 'and'})
                }
                if (condition.manager.id > 0) {
                    filter.push({field: 'managerid', value: condition.manager.id, operator: '=', relation: 'and'})
                }
                if (condition.director.id > 0) {
                    filter.push({
                        field: 'technicaldirectorid',
                        value: condition.director.id,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.startTime.max) {
                    filter.push({field: 'starttime', value: condition.startTime.max, operator: '<=', relation: 'and'})
                }
                if (condition.startTime.min) {
                    filter.push({field: 'starttime', value: condition.startTime.min, operator: '>=', relation: 'and'})
                }
                if (condition.endTime.max) {
                    filter.push({field: 'endTime', value: condition.endTime.max, operator: '<=', relation: 'and'})
                }
                if (condition.endTime.min) {
                    filter.push({field: 'endTime', value: condition.endTime.min, operator: '>=', relation: 'and'})
                }
                if (condition.isCompleted > -1) {
                    filter.push({field: 'isCompleted', value: condition.isCompleted, operator: '=', relation: 'and'})
                }
                if (condition.contractMode.Bid > 0) {
                    filter.push({
                        field: 'contractmodeBid',
                        value: condition.contractMode.Bid,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.contractMode.Aid > 0) {
                    filter.push({
                        field: 'contractmodeAid',
                        value: condition.contractMode.Aid,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.buildingType.Cid > 0) {
                    filter.push({
                        field: 'buildingtypeCid',
                        value: condition.buildingType.Cid,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.buildingType.Bid > 0) {
                    filter.push({
                        field: 'buildingtypeBid',
                        value: condition.buildingType.Bid,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.buildingType.Aid > 0) {
                    filter.push({
                        field: 'buildingtypeAid',
                        value: condition.buildingType.Aid,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.structuralForm.Aid > 0) {
                    filter.push({
                        field: 'structuralformsAid',
                        value: condition.structuralForm.Aid,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.structuralForm.Bid > 0) {
                    filter.push({
                        field: 'structuralformsBid',
                        value: condition.structuralForm.Bid,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.property.id > 0) {
                    filter.push({
                        field: 'projectpropertyid',
                        value: condition.property.id,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.fundingSources.id > 0) {
                    filter.push({
                        field: 'fundingsourceid',
                        value: condition.fundingSources.id,
                        operator: '=',
                        relation: 'and'
                    })
                }
                if (condition.cities.length > 0) {
                    var subFilter = [];
                    for (var i = 0; i < condition.cities.length; i++) {
                        var city = condition.cities[i];
                        subFilter.push({field: 'cityId', value: city, operator: '=', relation: 'or'})
                    }
                    filter.push(subFilter);
                }
                return filter;
            },
            loadPrjDetail: function (empid, callback) {
                var self = this;
                YT.query({
                    data: {
                        m: 5001001,
                        t: 'v_market_ep_project',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: empid, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object[0]);
                    }
                })
            },
            getPageIndex: function () {
                return pageIndex;
            },
            hasNextPage: function () {
                return hasNextPage;
            },
            loadProjectListCallBack: function (data) {
                var _projectList = data.object.items;
                for (var i = 0; i < _projectList.length; i++) {
                    projectList.push(_projectList[i]);
                }
                if (pageIndex >= data.object.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            setProjectList: function (_projectList) {
                projectList = _projectList;
            },
            refreshListData: function (successCallBack) {
                this.resetCondition();
                this.reloadData(successCallBack)
            },
            reloadData: function (successCallBack) {
                this.resetCachedData();
                this.loadProjectList(successCallBack);
            },
            resetCachedData: function () {
                this.setPageIndex(0);
                this.setHasNextPage(true);
                this.setProjectList([]);
            },
            resetCondition: function () {
                condition.org = {orgId: 0, orgName: '不限'};
                condition.cities = [];
                condition.provinces = [];
                condition.provinceText = '不限';
                condition.contractMode = {Aid: 0, name: '不限', Bid: 0, AName: ''};
                condition.buildingType = {Aid: 0, name: '不限', Bid: 0, Cid: 0, AName: '', BName: ''};
                condition.structuralForm = {Aid: 0, name: '不限', Bid: 0, AName: ''};
                condition.amount = {max: null, min: null};
                condition.manager = {id: 0, name: '不限'};
                condition.director = {id: 0, name: '不限'};
                condition.isCompleted = -1;
                condition.fundingSources = {id: 0, name: '不限'};
                condition.property = {id: 0, name: '不限'};
                condition.startTime = {max: '', min: ''};
                condition.endTime = {max: '', min: ''};
                condition.directorText = '';
                condition.managerText = '';
                return condition;
            },
            setPageIndex: function (_pageIndex) {
                pageIndex = _pageIndex;
            },
            setHasNextPage: function (_pageIndex) {
                hasNextPage = _pageIndex;
            },
            getProjectAttach: function (empid, callback) {
                YT.query({
                    data: {
                        m: 5001001,
                        t: 'v_market_ep_project_attach',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: empid, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getAward: function (id, callback) {
                YT.query({
                    data: {
                        m: 5001001,
                        t: 'v_market_ep_project_award',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getPunish: function (id, callback) {
                YT.query({
                    data: {
                        m: 5001001,
                        t: 'market_ep_project_punish',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getParam: function (id, callback) {
                YT.query({
                    data: {
                        m: 5001001,
                        t: 'v_market_ep_project_parameter',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        var paramMap = [];
                        var unit = [];
                        for (var i = 0; i < data.object.length; i++) {
                            var param = data.object[i];
                            if (param.paramKey == 'unit') {
                                unit.push(param.paramValue)
                            } else if (param.paramKey == 'quantityUnit') {
                                unit.push(param.paramValue)
                            } else {
                                paramMap.push(param)
                            }
                        }
                        if (unit.length > 0) {
                            for (var j = 0; j < paramMap.length; j++) {
                                if (paramMap[j].paramKey == 'quantity') {
                                    paramMap[j].paramUnit = unit[1];
                                } else if (paramMap[j].paramKey == 'bussinessScale') {
                                    paramMap[j].paramUnit = unit[0];
                                }
                            }
                        }
                        callback(paramMap);
                    }
                })
            },
            getAwardAttach: function (id, callback) {
                YT.query({
                    data: {
                        m: 5001001,
                        t: 'market_ep_project_award_attach',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getPunishAttach: function (id, callback) {
                YT.query({
                    data: {
                        m: 5001001,
                        t: 'market_ep_project_punish_attach',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getSubCompany: function (callback) {
                YT.query({
                    data: {
                        m: 5001002,
                        t: 'org_org',
                        filter: JSON.stringify([{
                            field: 'id',
                            value: userService.getRootOrgId(),
                            operator: '=',
                            relation: 'and'
                        }])
                    },
                    successCallback: function (result) {
                        if (result.status == 200) {
                            var filter = [
                                [{field: 'type', value: 2, operator: '=', relation: 'or'}, {
                                    field: 'type',
                                    value: 1,
                                    operator: '=',
                                    relation: 'and'
                                }],
                                {field: 'pid', value: result.object[0].pid, operator: '=', relation: ''}
                            ];
                            YT.query({
                                data: {m: 5001002, t: 'org_org', filter: JSON.stringify(filter)},
                                successCallback: function (data) {
                                    callback(data.object);
                                }
                            })
                        } else {
                            $.alert(result.message);
                        }
                    }
                })
            },
            downloadAttach: function (attach) {
                YT.download(attach);
            },
            getEmps: function (callback) {
                this.getTopOrgId(function (id) {
                    YT.query({
                        data: {
                            m: 5001002, t: 'v_market_ep_employee', filter: JSON.stringify([{
                                field: 'topOrgId', value: id, operator: '=', relation: ''
                            }])
                        },
                        successCallback: function (data) {
                            callback(data.object)
                        }
                    })
                })
            },
            getDatePickerTime: function (success) {
                var currentDate = new Date();
                var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                var time = {
                    date: date,
                    mondayFirst: false,
                    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    daysOfTheWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    startDate: new Date(1989, 1, 26),
                    endDate: new Date(2024, 1, 26),
                    disablePastDays: false,
                    disableSwipe: false,
                    disableWeekend: false,
                    disableDates: '',
                    showDatepicker: false,
                    showTodayButton: false,
                    calendarMode: false,
                    hideCancelButton: true,
                    hideSetButton: true,
                    callback: success
                };
                return time;
            },
            //获取二级联动的树结构
            getTreeData: function (callback, table) {
                var self = this;
                YT.query({
                    data: {
                        m: 5002001,
                        t: table
                    },
                    successCallback: function (data) {
                        var tree = [];
                        for (var i = 0; i < data.object.length; i++) {
                            // var mode = data.object[i];
                            // mode.subs = [];
                            // if (mode.pId == 0) {
                            //     tree.push(mode);
                            // } else {
                            //     for (var j = 0; j < tree.length; j++) {
                            //         if (tree[j].id == mode.pId) {
                            //             tree[j].subs.push(mode)
                            //         } else {
                            //             for (var k = 0; k < tree[j].subs.length; k++) {
                            //                 if(tree[j].subs[k].id == mode.pId){
                            //                     tree[j].subs[k].subs.push(mode);
                            //                 }
                            //             }
                            //         }
                            //     }
                            // }
                            if (data.object[i].pId == 0) {
                                var result = self.listToTree(data.object, data.object[i].id);
                                data.object[i].subs = result;
                                tree.push(data.object[i]);
                            }
                        }
                        callback(tree);
                    }
                })
            },
            listToTree: function (data, pid) {
                var result = [], temp, self = this;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].pId == pid) {
                        var obj = data[i];
                        temp = self.listToTree(data, data[i].id);
                        if (temp.length > 0) {
                            obj.subs = temp;
                        } else {
                            obj.subs = [];
                        }
                        result.push(obj);
                    }
                }
                return result;
            },
            //获取建筑类型
            getBuildingType: function (callback) {
                this.getTreeData(callback, 'market_d_buildingtype');
            },
            //获取结构性质
            getStructuralForm: function (callback) {
                this.getTreeData(callback, 'market_d_structuralforms');
            },
            //获取承包方式
            getContractMode: function (callback) {
                this.getTreeData(callback, 'market_d_contractmode');
            },
            //获取项目性质
            getProjectProperties: function (callback) {
                YT.query({
                    data: {
                        m: 5002001,
                        t: 'market_d_projectproperty'
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getFundingSources: function (callback) {
                YT.query({
                    data: {
                        m: 5002001,
                        t: 'market_d_fundingsource'
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getAreas: function (callback, filter) {
                YT.query({
                    data: {m: 5002001, t: 'dictionary_area', filter: JSON.stringify(filter)},
                    successCallback: function (data) {
                        for (var i = 0; i < data.object.length; i++) {
                            data.object[i].checked = false;
                            data.object[i].cityText = '';
                        }
                        callback(data.object);
                    }
                })
            },
            getProvinceText: function (array) {
                var checked = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].checked) {
                        checked.push(array[i]);
                    }
                }
                var text = '不限';
                if (checked.length == 1) {
                    text = checked[0].name;
                } else if (checked.length >= 2) {
                    text = checked[0].name + '等';
                }
                return text;
            },
            getCityText: function (arr) {
                var text = '';
                if (arr.length == 1) {
                    text = arr[0].name;
                } else if (arr.length == 2) {
                    text = arr[0].name + '等';
                }
                return text;
            },
            getIndex: function (arr, value, key) {
                var index = -1;
                for (var i = 0; i < arr.length; i++) {
                    if (key) {
                        if (arr[i][key] == value) {
                            index = i;
                        }
                    } else {
                        if (arr[i] == value) {
                            index = i;
                        }
                    }
                }
                return index;
            },
            clearCityData: function (arr, id, callback) {
                this.getAreas(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var index = arr.indexOf(data[i].id);
                        if (index > -1) {
                            arr.splice(index, 1);
                        }
                    }
                    if (callback) {
                        callback();
                    }
                }, [{field: 'pId', value: id, operator: '=', relation: ''}]);
            }
        }
    }])
;

