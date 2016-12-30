/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.salary')
    .factory("SalaryDetailService", ['YTService', 'UserService', 'env', function (YT, userService, env) {

        return {
            getSalaryDetail: function (personId, successCallback) {
                var data = {
                    m: 13002003,
                    t: 'v_subcontract_person_salarystatistics_personal',
                    order: 'recordYear desc,recordMonth desc'
                };
                var filter = [{field: 'personId', value: personId, operator: '=', relation: 'and'}];
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
