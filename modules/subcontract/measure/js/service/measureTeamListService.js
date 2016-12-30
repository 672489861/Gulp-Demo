/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.measure')
    .factory("MeasureTeamListService", ['YTService', 'UserService', function (YT, userService) {
        return {
            getMeasureTeamDetail: function (measureId, contractId, successCallback) {
                var data = {
                    m: 13003002,
                    t: 'v_subcontract_measure_statistics_team',
                    order: 'teamId'
                };
                var filter = [
                    {field: 'id', value: measureId, operator: '=', relation: 'and'},
                    {field: 'contractId', value: contractId, operator: '=', relation: 'and'}
                ];
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