/**
 * Created by zjw on 2016/10/31.
 */
angular.module('app.frame.dashboard')
    .factory("DashBoardSubcontractService", ['YTService', 'UserService', function (YT, userService) {
        var orgId = 0, teamCount = 0, personCount = 0, salaryTotal = 0, settlementTotal = 0; // 分包队伍个数，人数，工资发放合计，累计结算
        var teamList = []; // 班组信息
        return {
            getOrgId: function () {
                return orgId;
            },
            setOrgId: function (id) {
                orgId = id;
            },
            loadTeamCount: function (callback) {
                var filter = [
                    {field: 'orgId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: '1005',
                    t: 'v_subcontract_team',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            teamCount = data.object.length;
                            callback();
                        }
                    }
                });
            },
            loadPersonCount: function (callback) {
                var filter = [
                    {field: 'orgId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: '1005',
                    t: 'v_subcontract_person',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            personCount = data.object.length;
                            callback();
                        }
                    }
                });
            },
            loadSalaryTotal: function (callback) {
                var filter = [
                    {field: 'orgId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: '1005',
                    t: 'v_dashboard_subcontract_salarytotal',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            salaryTotal = data.object[0].salaryTotal;
                            callback();
                        }
                    }
                });
            },
            loadSettlementTotal: function (callback) {
                var filter = [
                    {field: 'orgId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: '1005',
                    t: 'v_dashboard_subcontract_settlementtotal',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            settlementTotal = data.object[0].settlementTotal;
                            callback();
                        }
                    }
                });
            },
            loadTeamList: function (callback) {
                var filter = [
                    {field: 'orgId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: '1005',
                    t: 'v_dashboard_subcontract_team',
                    filter: JSON.stringify(filter)
                };


                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            teamList = data.object;
                            callback();
                        }
                    }
                });
            },
            getTeamCount: function () {
                return teamCount;
            },
            getPersonCount: function () {
                return personCount;
            },
            getSalaryTotal: function () {
                return salaryTotal;
            },
            getSettlementTotal: function () {
                return settlementTotal;
            },
            getTeamList: function () {
                return teamList;
            }
        };
    }]);