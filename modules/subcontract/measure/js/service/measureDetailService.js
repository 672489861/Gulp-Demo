/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.measure')
    .factory("MeasureDetailService", ['YTService', 'UserService', function (YT, userService) {
        return {
            getMeasure: function (measureId, successCallback) {
                var data = {
                    m: 13003002,
                    t: 'v_subcontract_measure'
                };
                var filter = [{field: 'id', value: measureId, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback(data.object[0]);
                    }
                });
            },
            getMeasureDetail: function (measureId, successCallback) {
                var data = {
                    m: 13003002,
                    t: 'v_subcontract_measure_statistics_merchant'
                };
                var filter = [{field: 'id', value: measureId, operator: '=', relation: 'and'}];
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