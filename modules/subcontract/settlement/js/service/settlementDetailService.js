/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.settlement')
    .factory("SettlementDetailService", ['YTService', 'UserService', function (YT, userService) {
        // 合同内合计,合同外合计,材料扣款合计,其他费用扣款合计,其他费用追加合计,其他费用合计
        var settlementInTotal = 0, settlementOutTotal = 0, deductionTotal = 0, chargedTotal = 0, sumTotal = 0, otherTotal = 0;
        return {
            getSettlement: function (settlementId, successCallback) {
                var data = {
                    m: 13003003,
                    t: 'v_subcontract_settlement'
                };
                var filter = [{field: 'id', value: settlementId, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        var obj = data.object[0];
                        successCallback(obj);
                    }
                });
            },
            getSettlementDetail: function (settlementId, scope, successCallback) {
                var data = {
                    m: 13003003,
                    t: 'subcontract_settlement_detail'
                };
                var filter = [
                    {field: 'id', value: settlementId, operator: '=', relation: 'and'},
                    {field: 'scope', value: scope, operator: '=', relation: 'and'}
                ];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        var obj = data.object;
                        for (var i = 0; i < obj.length; i++) {
                            if (scope == "合同内") {
                                console.info(settlementInTotal + "-" + obj[i].total);
                                settlementInTotal = (parseFloat(settlementInTotal) + parseFloat(obj[i].total)).toFixed(2);
                            } else {
                                settlementOutTotal = (parseFloat(settlementOutTotal) + parseFloat(obj[i].total)).toFixed(2);
                            }
                        }
                        successCallback(obj);
                    }
                });
            },
            getSettlementMaterialDeduction: function (settlementId, successCallback) {
                var data = {
                    m: 13003003,
                    t: 'subcontract_settlement_materialdeduction'
                };
                var filter = [{field: 'id', value: settlementId, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        var obj = data.object;
                        for (var i = 0; i < obj.length; i++) {
                            deductionTotal = (parseFloat(deductionTotal) + parseFloat(obj[i].deductAmount)).toFixed(2);
                        }
                        successCallback(obj);
                    }
                });
            },
            getSettlementOtherExpenses: function (settlementId, successCallback) {
                var data = {
                    m: 13003003,
                    t: 'subcontract_settlement_otherexpenses'
                };
                var filter = [{field: 'id', value: settlementId, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        var obj = data.object;
                        for (var i = 0; i < obj.length; i++) {
                            // 1扣款 2追加
                            if (obj[i].chargeTypeId == 1) {
                                chargedTotal = (parseFloat(chargedTotal) + parseFloat(obj[i].amount)).toFixed(2);
                            } else {
                                sumTotal = (parseFloat(sumTotal) + parseFloat(obj[i].amount)).toFixed(2);
                            }
                        }
                        // 计算其他费用合计
                        otherTotal = sumTotal - chargedTotal;
                        successCallback(obj);
                    }
                });
            },
            getSettlementInTotal: function () {
                return settlementInTotal;
            },
            getSettlementOutTotal: function () {
                return settlementOutTotal;
            },
            getDeductionTotal: function () {
                return deductionTotal;
            },
            getChargedTotal: function () {
                return chargedTotal;
            },
            getSumTotal: function () {
                return sumTotal;
            },
            getOtherTotal: function () {
                return otherTotal;
            },
            clearTotal: function () {
                settlementInTotal = 0;
                settlementOutTotal = 0;
                deductionTotal = 0;
                chargedTotal = 0;
                sumTotal = 0;
                otherTotal = 0;
            }
        };
    }]);
