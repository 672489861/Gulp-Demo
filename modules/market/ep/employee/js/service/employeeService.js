angular.module('app.market.ep.employee')
    .factory('EmployeeService', ['YTService', 'UserService', function (YT, userService) {
        var employeeList = [],
            pageIndex = 0,
            pageSize = 10,
            condition = {
                isInsured: -1,
                sex: -1,
                realName: '',
                org: {
                    orgId: 0,
                    orgName: '不限'
                },
                orgId: 0,
                telephone: ''
            },
            hasNextPage = true;
        return {
            loadEmployeeList: function (successCallBack) {
                ++pageIndex;
                var self = this;
                self.getSearchData(function (data1) {
                    YT.query({
                        data: data1,
                        successCallback: function (data) {
                            self.loadEmployeeListCallBack(data);
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
                        t: 'v_market_ep_employee',
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
            getEmployeeList: function () {
                return employeeList;
            },
            getCondition: function () {
                return condition;
            },
            getSearchFilter: function (filter) {
                var isInsured = condition.isInsured,
                    sex = condition.sex,
                    realName = condition.realName,
                    orgId = condition.org.orgId,
                    telephone = condition.telephone;
                if (orgId > 0) {
                    filter.push({field: 'orgId', value: orgId, operator: '=', relation: 'and'})
                }
                if (realName) {
                    filter.push({field: 'realName', value: '%' + realName + '%', operator: 'like', relation: 'and'})
                }
                if (telephone) {
                    filter.push({field: 'telephone', value: '%' + telephone + '%', operator: 'like', relation: 'and'})
                }
                if (sex > -1) {
                    filter.push({field: 'sexType', value: sex, operator: '=', relation: 'and'})
                }
                if (isInsured > -1) {
                    filter.push({field: 'isinsured', value: isInsured, operator: '=', relation: 'and'})
                }

                return filter;
            },
            loadEmpDetail: function (empid, callback) {
                var self = this;
                YT.query({
                    data: {
                        m: 5001002,
                        t: 'v_market_ep_employee',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: empid, relation: ''}])
                    },
                    successCallback: function (data) {
                        data.object[0].photourl = self.getPhotoUrl(data.object[0].photourl);
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
            loadEmployeeListCallBack: function (data) {
                var _employeeList = data.object.items;
                for (var i = 0; i < _employeeList.length; i++) {
                    if (_employeeList[i].photoUrl) {
                        _employeeList[i].photoUrl = env.server + "" + _employeeList[i].photoUrl;
                    }
                    employeeList.push({
                        id: _employeeList[i].id,
                        name: _employeeList[i].realName,
                        orgName: _employeeList[i].orgName,
                        telephone: _employeeList[i].telephone,
                        photoUrl: _employeeList[i].photoUrl,
                        orgType: _employeeList[i].orgType
                    });
                }
                if (pageIndex >= data.object.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            setEmployeeList: function (_employeeList) {
                employeeList = _employeeList;
            },
            refreshListData: function (successCallBack) {
                this.resetCondition();
                this.reloadData(successCallBack)
            },
            reloadData: function (successCallBack) {
                this.resetCachedData();
                this.loadEmployeeList(successCallBack);
            },
            resetCachedData: function () {
                this.setPageIndex(0);
                this.setHasNextPage(true);
                this.setEmployeeList([]);
            },
            resetCondition: function () {
                condition.isInsured = -1,
                    condition.sex = -1,
                    condition.realName = '',
                    condition.org = {orgId: 0, orgName: '不限'},
                    condition.telephone = '';
                return condition;
            },
            setPageIndex: function (_pageIndex) {
                pageIndex = _pageIndex;
            },
            setHasNextPage: function (_pageIndex) {
                hasNextPage = _pageIndex;
            },
            getEmployeeAttatch: function (empid, callback) {
                YT.query({
                    data: {
                        m: 5001002,
                        t: 'market_ep_employee_attach',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: empid, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getTitle: function (id, callback) {
                YT.query({
                    data: {
                        m: 5001002,
                        t: 'v_market_ep_employee_title',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getCertificate: function (id, callback) {
                var self = this;
                YT.query({
                    data: {
                        m: 5001002,
                        t: 'v_market_ep_employee_certificate',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getTitleAttach: function (id, callback) {
                YT.query({
                    data: {
                        m: 5001002,
                        t: 'market_ep_employee_title_attach',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getCertificateAttach: function (id, callback) {
                YT.query({
                    data: {
                        m: 5001002,
                        t: 'market_ep_employee_certificate_attach',
                        filter: JSON.stringify([{field: 'id', operator: '=', value: id, relation: ''}])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                })
            },
            getProjects: function (dataId, callback) {
                YT.query({
                    data: {
                        m: 5001002,
                        t: 'v_market_ep_project',
                        filter: JSON.stringify([
                            {field: 'managerid', value: dataId, operator: '=', relation: 'or'},
                            {field: 'technicaldirectorid', value: dataId, operator: '=', relation: 'or'},
                            {field: 'constructioncrewid', value: dataId, operator: '=', relation: 'or'},
                            {field: 'qualityinspectorid', value: dataId, operator: '=', relation: 'or'},
                            {field: 'safetysupervisorid', value: dataId, operator: '=', relation: 'or'},
                            {field: 'materialstaffid', value: dataId, operator: '=', relation: 'or'},
                            {field: 'dataprocessorid', value: dataId, operator: '=', relation: 'or'},
                            {field: 'costestimatorid', value: dataId, operator: '=', relation: ''}
                        ])
                    },
                    successCallback: function (result) {
                        var projects = result.object;
                        callback(projects);
                    }
                });
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
            getPhotoUrl: function (url) {
                var fileUrl = '';
                if (url) {
                    var urls = url.split(',');
                    if (urls.length == 2 && urls[0] != undefined) {
                        fileUrl = YT.getFileUrl(urls[0], urls[1]);
                    }
                }
                return fileUrl;
            },
            downloadAttach: function (attach) {
                YT.download(attach);
            }
        }
    }])
;
