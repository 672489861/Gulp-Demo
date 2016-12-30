/**
 * Created by zjw on 2016/10/25.
 */
angular.module('app.frame.dashboard')
    .factory("SubscribeModuleService", ['YTService', 'UserService', '$ionicPopup', function (YT, userService, $ionicPopup) {
        var businessModules = [], projectModules = [], cloneBusinessModules = [], cloneProjectModules = [], nowChooseSubModule = null, maxTypeObj = null;
        var selectProjects = [], objByC = [], objByM = [], objByD = [], objBySubContract = [], orgListByC = [], orgListByM = [], orgListByD = [], orgListBySubContract = [];

        var projects = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true;

        businessModules.push(
            {
                moduleName: '合同管理',
                url: 'modules/frame/dashboard/contract.html',
                shortName: '合同',
                moduleId: 6,
                checked: false,
                subModules: [
                    [
                        {
                            moduleName: '总承包合同',
                            url: '',
                            moduleId: 6001001,
                            checked: false,
                            subModules: []
                        },
                        {moduleName: '分包合同', url: '', moduleId: 6001002, checked: false, subModules: []}
                    ],
                    [
                        {moduleName: '材料采购合同', url: '', moduleId: 6001003, checked: false, subModules: []},
                        {moduleName: '材料租赁合同', url: '', moduleId: 6001004, checked: false, subModules: []}
                    ],
                    [
                        {moduleName: '设备采购合同', url: '', moduleId: 6001005, checked: false, subModules: []},
                        {moduleName: '设备租赁合同', url: '', moduleId: 6001006, checked: false, subModules: []}
                    ],
                    [
                        {moduleName: '其他合同', url: '', moduleId: 6001007, checked: false, subModules: []}
                    ]
                ]
            },
            {
                moduleName: '责任人管理',
                url: 'modules/frame/dashboard/responser.html',
                shortName: '责任人',
                moduleId: 18,
                checked: false,
                subModules: [
                    [
                        {moduleName: '责任人动态', url: '', moduleId: 18001, checked: false, subModules: []},
                        {moduleName: '内部经营协议', url: '', moduleId: 18002, checked: false, subModules: []}
                    ]
                ]
            }
        );

        projectModules.push(
            {
                moduleName: '合同管理',
                url: 'modules/frame/dashboard/contract-project.html',
                shortName: '合同-项目部',
                moduleId: 6,
                checked: false,
                projects: [],
                subModules: [
                    [
                        {
                            moduleName: '分包合同',
                            url: '',
                            moduleId: 6001002,
                            parentModuleId: 6,
                            checked: false,
                            subModules: [],
                            projects: []
                        },
                        {
                            moduleName: '材料采购合同',
                            url: '',
                            moduleId: 6001003,
                            parentModuleId: 6,
                            checked: false,
                            subModules: [],
                            projects: []
                        }
                    ],
                    [
                        {
                            moduleName: '材料租赁合同',
                            url: '',
                            moduleId: 6001004,
                            parentModuleId: 6,
                            checked: false,
                            subModules: [],
                            projects: []
                        },
                        {
                            moduleName: '设备采购合同', url: '', moduleId: 6001005,
                            parentModuleId: 6, checked: false, subModules: [], projects: []
                        }
                    ],
                    [
                        {
                            moduleName: '设备租赁合同',
                            url: '',
                            moduleId: 6001006,
                            parentModuleId: 6,
                            checked: false,
                            subModules: [],
                            projects: []
                        },
                        {
                            moduleName: '其他合同',
                            url: '',
                            moduleId: 6001007,
                            parentModuleId: 6,
                            checked: false,
                            subModules: [],
                            projects: []
                        }
                    ]
                ]
            },
            {
                moduleName: '材料管理',
                url: 'modules/frame/dashboard/material.html',
                shortName: '材料',
                moduleId: 10,
                checked: false,
                projects: [],
                subModules: [
                    [
                        {
                            moduleName: '材料入库',
                            url: '',
                            moduleId: 10003001001,
                            parentModuleId: 10,
                            checked: false,
                            subModules: [],
                            projects: []
                        },
                        {
                            moduleName: '材料出库',
                            url: '',
                            moduleId: 10003001002,
                            parentModuleId: 10,
                            checked: false,
                            subModules: [],
                            projects: []
                        }
                    ],
                    [
                        {
                            moduleName: '材料退库',
                            url: '',
                            moduleId: 10003001003,
                            parentModuleId: 10,
                            checked: false,
                            subModules: [],
                            projects: []
                        },
                        {
                            moduleName: '材料报废',
                            url: '',
                            moduleId: 10003001004,
                            parentModuleId: 10,
                            checked: false,
                            subModules: [],
                            projects: []
                        }
                    ],
                    [
                        {
                            moduleName: '材料结算',
                            url: '',
                            moduleId: 10003001005,
                            parentModuleId: 10,
                            checked: false,
                            subModules: [],
                            projects: []
                        },
                        {
                            moduleName: '材料退货',
                            url: '',
                            moduleId: 10003001006,
                            parentModuleId: 10,
                            checked: false,
                            subModules: [],
                            projects: []
                        }
                    ]
                ]
            },
            {
                moduleName: '设备管理',
                url: 'modules/frame/dashboard/device.html',
                shortName: '设备',
                moduleId: 12,
                checked: false,
                projects: [],
                subModules: [
                    [
                        {
                            moduleName: '设备信息',
                            url: '',
                            moduleId: 12001,
                            parentModuleId: 12,
                            checked: false,
                            subModules: [],
                            projects: []
                        }
                    ]
                ]
            },
            {
                moduleName: '分包管理',
                url: 'modules/frame/dashboard/subcontract.html',
                shortName: '分包',
                moduleId: 13,
                checked: false,
                projects: [],
                subModules: [
                    [
                        {
                            moduleName: '劳务进退场',
                            url: '',
                            moduleId: 13002001,
                            parentModuleId: 13,
                            checked: false,
                            subModules: [],
                            projects: []
                        },
                        {
                            moduleName: '劳务工资',
                            url: '',
                            moduleId: 13002003,
                            parentModuleId: 13,
                            checked: false,
                            subModules: [],
                            projects: []
                        }
                    ],
                    [
                        {
                            moduleName: '分包计量',
                            url: '',
                            moduleId: 13003002,
                            parentModuleId: 13,
                            checked: false,
                            subModules: [],
                            projects: []
                        },
                        {
                            moduleName: '分包结算',
                            url: '',
                            moduleId: 13003003,
                            parentModuleId: 13,
                            checked: false,
                            subModules: [],
                            projects: []
                        }
                    ]
                ]
            }
        );
        return {
            getBusinessModules: function () {
                return businessModules;
            },
            getProjectModules: function () {
                return projectModules;
            },
            getCloneBusinessModules: function () {
                return cloneBusinessModules;
            },
            getCloneProjectModules: function () {
                return cloneProjectModules;
            },
            cloneModules: function () {
                cloneBusinessModules = YT.clone(businessModules);
                cloneProjectModules = YT.clone(projectModules);
            },
            getUserTypeInfo: function (callback) {
                YT.query({
                    data: {
                        m: 1005,
                        t: 'v_frame_org_user',
                        filter: JSON.stringify([
                            {field: 'userId', value: userService.getUserId(), operator: '=', relation: 'AND'}
                        ])
                    },
                    successCallback: function (data) {
                        if (data.status == 200) {
                            var maxType = data.object[0].type;
                            var obj = data.object[0];
                            for (var i = 1; i < data.object.length; i++) {
                                if (data.object[i].type < maxType) {
                                    maxType = data.object[i].type;
                                    obj = data.object[i];
                                }
                            }
                            callback(obj);
                        }
                    }
                });
            },
            getSearchData: function (searchText) {
                var filter = [
                    {field: 'type', value: 3, operator: '=', relation: 'and'}
                ];

                if (maxTypeObj.type == 1) {
                    filter.push({field: 'groupId', value: maxTypeObj.rootId, operator: '=', relation: 'and'});
                } else if (maxTypeObj.type == 2) {
                    filter.push({field: 'pid', value: maxTypeObj.rootId, operator: '=', relation: 'and'});
                }

                if (searchText != undefined && searchText != "") {
                    filter.push({field: 'name', value: "%" + searchText + "%", operator: 'like', relation: 'and'})
                }

                var data = {
                    m: 1003,
                    t: 'v_org_org_extend',
                    filter: JSON.stringify(filter),
                    page: pageIndex,
                    rows: pageSize
                };

                return data;
            },
            setProjectModulesOrg: function (data) {
                for (var i = 0; i < projectModules.length; i++) {
                    var projectModule = projectModules[i];
                    projectModule.projects.length = 0;
                    angular.forEach(data, function (data, index) {
                        projectModule.projects.push({
                            id: data.id,
                            name: data.name,
                            checked: false
                        });
                    });
                    for (var j = 0; j < projectModule.subModules.length; j++) {
                        var projectSubModule = projectModule.subModules[j];
                        for (var k = 0; k < projectSubModule.length; k++) {
                            projectSubModule[k].projects.length = 0;
                            angular.forEach(data, function (data, index) {
                                projectSubModule[k].projects.push({
                                    id: data.id,
                                    name: data.name,
                                    checked: false
                                });
                            });
                        }
                    }
                }
            },
            getSubscribeModules: function (callback) {
                // 获取当前用户订阅情况
                var filter = [
                    {field: 'userId', value: userService.getUserId(), operator: '=', relation: 'and'}
                ];
                var data = {
                    m: 1005,
                    t: 'dashboard_modules_subscribe',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            callback(data.object);
                        }
                    }
                });
            },
            setSubscribeModules: function () {
                // 获取当前用户所处组织消息订阅情况
                this.getSubscribeModules(function (data) {
                    if (maxTypeObj.type < 3) {
                        // 遍历企业管理
                        for (var i = 0; i < businessModules.length; i++) {
                            var businessModule = businessModules[i];
                            var uncheckedCount = 0;
                            for (var j = 0; j < businessModule.subModules.length; j++) {
                                var subModule = businessModule.subModules[j];
                                for (var k = 0; k < subModule.length; k++) {
                                    // 过滤结果集
                                    for (var u = 0; u < data.length; u++) {
                                        var subscribeOrgId = userService.getRootOrgId();
                                        if (userService.getTypeId() == 3) {
                                            subscribeOrgId = maxTypeObj.rootId;
                                        }
                                        if (data[u].subscribeOrgId == subscribeOrgId && data[u].moduleId == subModule[k].moduleId) {
                                            subModule[k].checked = true;
                                            break;
                                        }
                                    }
                                    if (!subModule[k].checked) {
                                        uncheckedCount++;
                                    }
                                }
                            }
                            businessModule.checked = uncheckedCount == 0;
                        }
                    }
                    // 遍历项目管理
                    for (var i = 0; i < projectModules.length; i++) {
                        var projectModule = projectModules[i];
                        var uncheckedCount = 0;
                        for (var j = 0; j < projectModule.subModules.length; j++) {
                            var subModule = projectModule.subModules[j];
                            for (var z = 0; z < subModule.length; z++) {
                                if (maxTypeObj.type < 3) {
                                    for (var k = 0; k < subModule[z].projects.length; k++) {
                                        var module = subModule[z].projects[k];
                                        // 过滤结果集
                                        for (var u = 0; u < data.length; u++) {
                                            if (data[u].subscribeOrgId == module.id && data[u].moduleId == subModule[z].moduleId) {
                                                subModule[z].projects[k].checked = true;
                                                subModule[z].checked = true;
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    for (var u = 0; u < data.length; u++) {
                                        if (subModule[z].moduleId == data[u].moduleId) {
                                            subModule[z].checked = true;
                                            break;
                                        }
                                    }
                                }
                                if (!subModule[z].checked) {
                                    uncheckedCount++;
                                }
                            }
                        }
                        projectModule.checked = uncheckedCount == 0;
                    }
                    // 遍历完之后克隆
                    cloneBusinessModules = YT.clone(businessModules);
                    cloneProjectModules = YT.clone(projectModules);
                });
            },
            getSubProject: function (pid, callback, searchText) {
                var filter = [
                    {field: 'type', value: 3, operator: '=', relation: 'and'},
                    {field: 'pid', value: pid, operator: '=', relation: ''}
                ];
                if (searchText != undefined && searchText != "") {
                    filter.push({field: 'name', value: "%" + searchText + "%", operator: 'like', relation: 'and'})
                }

                var data = {
                    m: 1003,
                    t: 'v_org_org_extend',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            callback(data.object);
                        }
                    }
                });
            },
            getGroupProject: function (groupId, callback, searchText) {
                var filter = [
                    {field: 'type', value: 3, operator: '=', relation: 'and'},
                    {field: 'groupId', value: groupId, operator: '=', relation: ''}
                ];
                if (searchText != undefined && searchText != "") {
                    filter.push({field: 'name', value: "%" + searchText + "%", operator: 'like', relation: 'and'})
                }

                var data = {
                    m: 1003,
                    t: 'v_org_org_extend',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            callback(data.object);
                        }
                    }
                });
            },
            setNowChooseSubModule: function (subModule) {
                nowChooseSubModule = subModule;
            },
            getNowChooseSubModule: function () {
                return nowChooseSubModule;
            },
            setChooseOrg: function (projects) {
                if (nowChooseSubModule.hasOwnProperty("shortName")) {
                    var flag = false;
                    for (var k = 0; k < nowChooseSubModule.projects.length; k++) {
                        for (var g = 0; g < projects.length; g++) {
                            if (projects[g].id == nowChooseSubModule.projects[k].id) {
                                nowChooseSubModule.projects[k].checked = projects[g].checked;
                                if (nowChooseSubModule.projects[k].checked) {
                                    flag = true;
                                }
                                break;
                            }
                        }
                    }
                    nowChooseSubModule.checked = flag;
                    for (var j = 0; j < nowChooseSubModule.subModules.length; j++) {
                        var subModule = nowChooseSubModule.subModules[j];
                        for (var z = 0; z < subModule.length; z++) {
                            subModule[z].checked = flag;
                            for (var o = 0; o < subModule[z].projects.length; o++) {
                                subModule[z].projects[o].checked = nowChooseSubModule.projects[o].checked;
                            }
                        }
                    }
                } else {
                    var flag = false;
                    for (var k = 0; k < nowChooseSubModule.projects.length; k++) {
                        for (var g = 0; g < projects.length; g++) {
                            if (projects[g].id == nowChooseSubModule.projects[k].id) {
                                nowChooseSubModule.projects[k].checked = projects[g].checked;
                                if (nowChooseSubModule.projects[k].checked) {
                                    flag = true;
                                }
                                break;
                            }
                        }
                    }
                    nowChooseSubModule.checked = flag;
                    flag = false;
                    for (var i = 0; i < cloneProjectModules.length; i++) {
                        var projectModule = cloneProjectModules[i];
                        for (var j = 0; j < projectModule.projects.length; j++) {
                            projectModule.projects[j].checked = false;
                        }
                        if (projectModule.moduleId == nowChooseSubModule.parentModuleId) {
                            for (var j = 0; j < projectModule.subModules.length; j++) {
                                var subModule = projectModule.subModules[j];
                                for (var z = 0; z < subModule.length; z++) {
                                    if (!subModule[z].checked) {
                                        flag = true;
                                    }
                                }
                            }
                            projectModule.checked = !flag;
                            break;
                        }
                    }
                }
            },
            setModuleChecked: function () {
                if (nowChooseSubModule.hasOwnProperty("shortName")) {
                    var flag = false;
                    // 判断是否选中部门
                    for (var k = 0; k < nowChooseSubModule.projects.length; k++) {
                        if (nowChooseSubModule.projects[k].checked) {
                            nowChooseSubModule.checked = true;
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        nowChooseSubModule.checked = false;
                    }
                    var selectCount = 0;
                    for (var j = 0; j < nowChooseSubModule.subModules.length; j++) {
                        var subModule = nowChooseSubModule.subModules[j];
                        for (var z = 0; z < subModule.length; z++) {
                            for (var k = 0; k < subModule[z].projects.length; k++) {
                                if (subModule[z].projects[k].checked) {
                                    subModule[z].checked = true;
                                    selectCount++;
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                subModule[z].checked = false;
                            }
                            // 重置flag
                            flag = false;
                        }
                    }
                    var moduleCount = 0;
                    for (var i = 0; i < nowChooseSubModule.subModules.length; i++) {
                        var subModule = nowChooseSubModule.subModules[i];
                        for (var z = 0; z < subModule.length; z++) {
                            moduleCount++;
                        }
                    }
                    // 当所有子集都选中状态时  父选项成勾选状态
                    if (selectCount == moduleCount) {
                        nowChooseSubModule.checked = true;
                    }
                } else {
                    var flag = false;
                    for (var k = 0; k < nowChooseSubModule.projects.length; k++) {
                        if (nowChooseSubModule.projects[k].checked) {
                            nowChooseSubModule.checked = true;
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        nowChooseSubModule.checked = false;
                    }
                    var moduleCount = 0, selectCount = 0;
                    for (var i = 0; i < cloneProjectModules.length; i++) {
                        var projectModule = cloneProjectModules[i];
                        if (projectModule.moduleId == nowChooseSubModule.parentModuleId) {
                            for (var j = 0; j < projectModule.subModules.length; j++) {
                                var subModule = projectModule.subModules[j];
                                for (var z = 0; z < subModule.length; z++) {
                                    moduleCount++;
                                    if (subModule[z].checked) {
                                        selectCount++;
                                    }
                                }
                            }
                            projectModule.checked = (selectCount == moduleCount);
                            break;
                        }
                    }
                }
            },
            save: function ($scope, callback) {
                // 组装数据
                var datas = [];
                var type = $scope.type
                if (type < 3) {
                    // 项目管理数据
                    for (var i = 0; i < cloneProjectModules.length; i++) {
                        var projectModule = cloneProjectModules[i];
                        for (var j = 0; j < projectModule.subModules.length; j++) {
                            var subModule = projectModule.subModules[j];
                            for (var z = 0; z < subModule.length; z++) {
                                if (subModule[z].checked) {
                                    for (var k = 0; k < subModule[z].projects.length; k++) {
                                        var module = subModule[z].projects[k];
                                        if (module.checked) {
                                            datas.push({
                                                userId: userService.getUserId(),
                                                moduleId: subModule[z].moduleId,
                                                subscribeOrgId: module.id
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // 企业管理数据
                    for (var i = 0; i < cloneBusinessModules.length; i++) {
                        var businessModule = cloneBusinessModules[i];
                        for (var j = 0; j < businessModule.subModules.length; j++) {
                            var subModule = businessModule.subModules[j];
                            for (var k = 0; k < subModule.length; k++) {
                                if (subModule[k].checked) {
                                    var subscribeOrgId = userService.getRootOrgId();
                                    // 当前处于项目部
                                    if (userService.getTypeId() == 3) {
                                        subscribeOrgId = maxTypeObj.rootId;
                                    }
                                    datas.push({
                                        userId: userService.getUserId(),
                                        moduleId: subModule[k].moduleId,
                                        subscribeOrgId: subscribeOrgId
                                    });
                                }
                            }
                        }
                    }
                } else {
                    // 只有项目部身份
                    for (var i = 0; i < cloneProjectModules.length; i++) {
                        var projectModule = cloneProjectModules[i];
                        for (var j = 0; j < projectModule.subModules.length; j++) {
                            var subModule = projectModule.subModules[j];
                            for (var z = 0; z < subModule.length; z++) {
                                if (subModule[z].checked) {
                                    datas.push({
                                        userId: userService.getUserId(),
                                        moduleId: subModule[z].moduleId,
                                        subscribeOrgId: userService.getRootOrgId()
                                    });
                                }
                            }
                        }
                    }
                }
                // 面板是跟着人走的 先删除 再插入数据
                YT.delete({
                    data: {
                        m: 1005,
                        t: 'dashboard_modules_subscribe',
                        filter: JSON.stringify([{
                            field: 'userId',
                            value: userService.getUserId(),
                            operator: '=',
                            relation: 'AND'
                        }]),
                        params: JSON.stringify({
                            datas: datas
                        })
                    },
                    successCallback: function (data) {
                        if (data.status == 200) {
                            // 刷新当前页面
                            var alertPopup = $ionicPopup.alert({
                                title: '提示',
                                template: '订阅成功！'
                            });
                            alertPopup.then(function (res) {
                                // 和真实数据同步,以便加载新订阅的数据
                                businessModules = YT.clone(cloneBusinessModules);
                                projectModules = YT.clone(cloneProjectModules);
                                callback();
                            });

                        }
                    }
                });
            },
            setSelectedProjects: function () {
                if (maxTypeObj.type < 3) {
                    selectProjects.length = 0;
                    for (var i = 0; i < projectModules.length; i++) {
                        var projectModule = projectModules[i];
                        for (var j = 0; j < projectModule.subModules.length; j++) {
                            var subModule = projectModule.subModules[j];
                            for (var z = 0; z < subModule.length; z++) {
                                for (var k = 0; k < subModule[z].projects.length; k++) {
                                    if (subModule[z].projects[k].checked) {
                                        var flag = false;
                                        for (var b = 0; b < selectProjects.length; b++) {
                                            if (selectProjects[b].id == subModule[z].projects[k].id) {
                                                flag = true;
                                                selectProjects[b].modules.push({
                                                    moduleId: subModule[z].moduleId,
                                                    parentModuleId: projectModule.moduleId
                                                });
                                                break;
                                            }
                                        }
                                        if (!flag) {
                                            selectProjects.push({
                                                id: subModule[z].projects[k].id,
                                                name: subModule[z].projects[k].name,
                                                checked: true,
                                                modules: [{
                                                    moduleId: subModule[z].moduleId,
                                                    parentModuleId: projectModule.moduleId
                                                }]
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            getSelectedModules: function () {
                var selectedModules = [];
                // 企业管理
                if (maxTypeObj.type < 3) {
                    for (var i = 0; i < businessModules.length; i++) {
                        var businessModule = businessModules[i];
                        var flag = false;
                        for (var j = 0; j < businessModule.subModules.length && !flag; j++) {
                            var subModule = businessModule.subModules[j];
                            for (var k = 0; k < subModule.length && !flag; k++) {
                                if (subModule[k].checked) {
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if (flag) {
                            selectedModules.push(businessModule);
                        }
                    }
                }
                // 项目管理
                for (var i = 0; i < projectModules.length; i++) {
                    var projectModule = projectModules[i];
                    var flag = false;
                    for (var j = 0; j < projectModule.subModules.length && !flag; j++) {
                        var subModule = projectModule.subModules[j];
                        for (var z = 0; z < subModule.length && !flag; z++) {
                            if (subModule[z].checked) {
                                flag = true;
                                break;
                            }
                        }
                    }
                    if (flag) {
                        selectedModules.push(projectModule);
                    }
                }
                return selectedModules;
            },
            loadProjectListData: function (searchText, successCallback) {
                ++pageIndex;
                var self = this;
                YT.query({
                    data: self.getSearchData(searchText),
                    successCallback: function (data) {
                        self.loadListDataCallback(data);
                        successCallback.call();
                    }
                });
            },
            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    projects.push(pageInfo.items[i]);
                }
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            refreshProjectListData: function (searchText, successCallBack) {
                this.clearCachedData();
                this.loadProjectListData(searchText, successCallBack);
            },
            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                projects = [];
            },
            hasNextPage: function () {
                return hasNextPage;
            },
            getProjects: function () {
                return projects;
            },
            setMaxTypeObj: function (data) {
                maxTypeObj = data;
                return maxTypeObj;
            },
            getMaxTypeObj: function () {
                return maxTypeObj;
            },
            getSelectedProjects: function () {
                return selectProjects;
            },
            getOrgAndModule: function () {
                var self = this;
                // 清空项目部列表
                orgListByC.length = 0;
                orgListByM.length = 0;
                orgListByD.length = 0;
                orgListBySubContract.length = 0;

                for (var i = 0; i < selectProjects.length; i++) {
                    var moduleListByC = [], moduleListByM = [], moduleListByD = [], moduleListBySubContract = []; // 权限列表
                    var pModuleByC = 0, pModuleByM = 0, pModuleByD = 0, pModuleBySubContract = 0;

                    var org = selectProjects[i];
                    var id = org.id;
                    var name = org.name;
                    var modules = org.modules;
                    for (var j = 0; j < modules.length; j++) {
                        var module = modules[j];
                        var moduleId = module.moduleId;
                        var parentModuleId = module.parentModuleId;
                        // 合同 - 项目部
                        if (parentModuleId == 6) {
                            pModuleByC = 6;
                            if (moduleId == 6001002) { // 分包
                                moduleListByC[60102] = true;
                            }
                            if (moduleId == 6001003) { // 材料采购
                                moduleListByC[60103] = true;
                            }
                            if (moduleId == 6001004) { // 材料租赁
                                moduleListByC[60104] = true;
                            }
                            if (moduleId == 6001005) { // 设备采购
                                moduleListByC[60105] = true;
                            }
                            if (moduleId == 6001006) { // 设备租赁
                                moduleListByC[60106] = true;
                            }
                            if (moduleId == 6001007) { // 其他
                                moduleListByC[60107] = true;
                            }
                        }

                        // 材料 - 项目部
                        if (parentModuleId == 10) {
                            pModuleByM = 10;
                            if (moduleId == 10003001001) { // 入库
                                moduleListByM[100301] = true;
                            }
                            if (moduleId == 10003001002) { // 出库
                                moduleListByM[100302] = true;
                            }
                            if (moduleId == 10003001003) { // 退库
                                moduleListByM[100303] = true;
                            }
                            if (moduleId == 10003001004) { // 报废
                                moduleListByM[100304] = true;
                            }
                            if (moduleId == 10003001005) { // 结算
                                moduleListByM[100305] = true;
                            }
                            if (moduleId == 10003001006) { // 退货
                                moduleListByM[100306] = true;
                            }
                        }

                        // 设备 - 项目部
                        if (parentModuleId == 12) {
                            pModuleByD = 12;
                            if (moduleId == 12001) { // 设备信息
                                moduleListByD[12001] = true;
                            }
                        }

                        // 分包-项目部
                        if (parentModuleId == 13) {
                            pModuleBySubContract = 13;
                            if (moduleId == 13002001) { // 劳务进退场
                                moduleListBySubContract[13002001] = true;
                            }
                            if (moduleId == 13002003) { // 劳务工资
                                moduleListBySubContract[13002003] = true;
                            }
                            if (moduleId == 13003002) { // 分包计量
                                moduleListBySubContract[13003002] = true;
                            }
                            if (moduleId == 13003003) { // 分包结算
                                moduleListBySubContract[13003003] = true;
                            }
                        }
                    }

                    if (pModuleByC) {
                        orgListByC.push({
                            id: id,
                            name: name
                        });
                        objByC[id] = {
                            id: id,
                            name: name,
                            moduleListByC: moduleListByC
                        };
                    }
                    if (pModuleByM) {
                        orgListByM.push({
                            id: id,
                            name: name
                        });
                        objByM[id] = {
                            id: id,
                            name: name,
                            moduleListByM: moduleListByM
                        };
                    }
                    if (pModuleByD) {
                        orgListByD.push({
                            id: id,
                            name: name
                        });
                        objByD[id] = {
                            id: id,
                            name: name,
                            moduleListByD: moduleListByD
                        };
                    }
                    if (pModuleBySubContract) {
                        orgListBySubContract.push({
                            id: id,
                            name: name
                        });
                        objBySubContract[id] = {
                            id: id,
                            name: name,
                            moduleListBySubContract: moduleListBySubContract
                        };
                    }
                }

                // 如果只有项目部
                if (maxTypeObj.type == 3) {
                    var rootOrgId = userService.getRootOrgId();
                    var orgName = userService.getRootOrgName();
                    var moduleListByC = [], moduleListByM = [], moduleListByD = [], moduleListBySubContract = [];
                    orgListByC.length = 0;
                    orgListByM.length = 0;
                    orgListByD.length = 0;
                    orgListBySubContract.length = 0;
                    orgListByC.push({id: rootOrgId, name: orgName});
                    orgListByM.push({id: rootOrgId, name: orgName});
                    orgListByD.push({id: rootOrgId, name: orgName});
                    orgListBySubContract.push({id: rootOrgId, name: orgName});
                    var modules = self.getSelectedModules();
                    for (var i = 0; i < modules.length; i++) {
                        for (var j = 0; j < modules[i].subModules.length; j++) {
                            var subModule = modules[i].subModules[j];
                            for (var k = 0; k < subModule.length; k++) {
                                var module = subModule[k];
                                var moduleId = module.moduleId;
                                if (modules[i].moduleId == 6) {
                                    if (moduleId == 6001002) { // 分包
                                        moduleListByC[60102] = true;
                                    }
                                    if (moduleId == 6001003) { // 材料采购
                                        moduleListByC[60103] = true;
                                    }
                                    if (moduleId == 6001004) { // 材料租赁
                                        moduleListByC[60104] = true;
                                    }
                                    if (moduleId == 6001005) { // 设备采购
                                        moduleListByC[60105] = true;
                                    }
                                    if (moduleId == 6001006) { // 设备租赁
                                        moduleListByC[60106] = true;
                                    }
                                    if (moduleId == 6001007) { // 其他
                                        moduleListByC[60107] = true;
                                    }

                                } else if (modules[i].moduleId == 10) {
                                    if (moduleId == 10003001001) { // 入库
                                        moduleListByM[100301] = true;
                                    }
                                    if (moduleId == 10003001002) { // 出库
                                        moduleListByM[100302] = true;
                                    }
                                    if (moduleId == 10003001003) { // 退库
                                        moduleListByM[100303] = true;
                                    }
                                    if (moduleId == 10003001004) { // 报废
                                        moduleListByM[100304] = true;
                                    }
                                    if (moduleId == 10003001005) { // 结算
                                        moduleListByM[100305] = true;
                                    }
                                    if (moduleId == 10003001006) { // 退货
                                        moduleListByM[100306] = true;
                                    }
                                } else if (modules[i].moduleId == 12) {
                                    if (moduleId == 12001) { // 设备信息
                                        moduleListByD[12001] = true;
                                    }
                                } else if (modules[i].moduleId == 13) {
                                    if (moduleId == 13002001) { // 劳务进退场
                                        moduleListBySubContract[13002001] = true;
                                    }
                                    if (moduleId == 13002003) { // 劳务工资
                                        moduleListBySubContract[13002003] = true;
                                    }
                                    if (moduleId == 13003002) { // 分包计量
                                        moduleListBySubContract[13003002] = true;
                                    }
                                    if (moduleId == 13003003) { // 分包结算
                                        moduleListBySubContract[13003003] = true;
                                    }
                                }

                            }
                        }
                    }

                    objByC[rootOrgId] = {
                        id: rootOrgId,
                        name: orgName,
                        moduleListByC: moduleListByC
                    };
                    objByD[rootOrgId] = {
                        id: rootOrgId,
                        name: orgName,
                        moduleListByD: moduleListByD
                    };
                    objByM[rootOrgId] = {
                        id: rootOrgId,
                        name: orgName,
                        moduleListByM: moduleListByM
                    };
                    objBySubContract[rootOrgId] = {
                        id: rootOrgId,
                        name: orgName,
                        moduleListBySubContract: moduleListBySubContract
                    };
                }
            },
            getOrgListByC: function () {
                return orgListByC;
            },
            getOrgListByM: function () {
                return orgListByM;
            },
            getOrgListByD: function () {
                return orgListByD;
            },
            getObjByC: function () {
                return objByC;
            },
            getObjByM: function () {
                return objByM;
            },
            getObjByD: function () {
                return objByD;
            },
            getOrgListBySubContract: function () {
                return orgListBySubContract;
            },
            getObjBySubContract: function () {
                return objBySubContract;
            }
        }
    }]
);