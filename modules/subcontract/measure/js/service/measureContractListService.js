/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.measure')
    .factory("MeasureContractListService", ['YTService', 'UserService', function (YT, userService) {
        return {
            getMeasureContractDetail: function (measureId, merchantId, successCallback) {
                var data = {
                    m: 13003002,
                    t: 'v_subcontract_measure_statistics_contract',
                    order: 'contractId'
                };
                var filter = [
                    {field: 'id', value: measureId, operator: '=', relation: 'and'},
                    {field: 'merchantId', value: merchantId, operator: '=', relation: 'and'}
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