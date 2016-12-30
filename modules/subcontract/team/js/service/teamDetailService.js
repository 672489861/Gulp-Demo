/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract.team')
    .factory("TeamDetailService", ['YTService', 'UserService', function (YT, userService) {
        return {
            getTeamDetail: function (teamId, successCallback) {
                var data = {
                    m: 13002001,
                    t: 'v_subcontract_team'
                };
                var filter = [{field: 'id', value: teamId, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback(data.object[0]);
                    }
                });
            },
            getTeamWorkContentDetail: function (teamId, successCallback) {
                var data = {
                    m: 13002001,
                    t: 'v_subcontract_team_workcontent_mobile'
                };
                var filter = [{field: 'id', value: teamId, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback(data.object);
                    }
                });
            }
        };
    }]);
