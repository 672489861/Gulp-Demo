angular.module('app.frame.dashboard')
    .factory("MaterialService", ['YTService', 'UserService', function (YT, userService) {
        var amount1 = 0, balanceAmount1 = 0, amount2 = 0, balanceAmount2 = 0, amount3 = 0, amount4 = 0, amount5 = 0, amount6 = 0;
        var list1 = [], list2 = [], list3 = [], list4 = [], list5 = [], list6 = [];
        var orgId = 0;

        return {
            getMaterial: function (callback) {
                var self = this;
                self.clearMaterialData();
                self.getPurchase(function () { // 采购入库
                    self.getLease(function () { // 租赁入库
                        self.getReimburse(function () { // 退库
                            self.getReturn(function () { // 退货
                                self.getBroken(function () { // 报损
                                    self.getRecipients(function () { // 领用
                                        callback.call();
                                    });
                                });
                            });
                        });
                    });
                });
            },
            getPurchase: function (callback) {
                var params = {
                    t: 'v_dashboard_material_purchase',
                    order: 'merchantId asc'
                };

                this.ajax(params, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        list1.push(obj);
                        amount1 += +obj.purchaseAmount;
                        balanceAmount1 += +obj.balanceAmout;
                    }

                    callback();
                });
            },
            getLease: function (callback) {
                var params = {
                    t: 'v_dashboard_material_lease',
                    order: 'merchantId asc'
                };

                this.ajax(params, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        list2.push(obj);
                        amount2 += +obj.purchaseAmount;
                        balanceAmount2 += +obj.balanceAmout;
                    }

                    callback();
                });
            },
            getReimburse: function (callback) {
                var params = {
                    t: 'v_dashboard_material_reimburse',
                    order: 'teamName asc'
                };

                this.ajax(params, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        list4.push(obj);
                        amount4 += +obj.amount;
                    }

                    callback();
                });
            },
            getReturn: function (callback) {
                var params = {
                    t: 'v_dashboard_material_return',
                    order: 'projectId asc'
                };

                this.ajax(params, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        list5.push(obj);
                        amount5 += +obj.amount;
                    }
                });

                callback();
            },
            getBroken: function (callback) {
                var params = {
                    t: 'v_dashboard_material_broken',
                    order: 'projectId asc'
                };

                this.ajax(params, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        list6.push(obj);
                        amount6 += +obj.amount;
                    }

                    callback();
                });
            },
            getRecipients: function (callback) {
                var filter = [
                    {field: 'orgId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: 1005,
                    t: 'v_material_money_summary',
                    filter: JSON.stringify(filter)
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {
                            for (var i = 0; i < data.object.length; i++) {
                                var obj = data.object[i];
                                list3.push(obj);
                                amount3 += +obj.deliveryAmounts;
                            }
                            callback();
                        }
                    }
                });
            },
            ajax: function (params, callback) {
                var filter = [
                    {field: 'projectId', value: orgId, operator: '=', relation: 'AND'}
                ];

                var data = {
                    m: 1005,
                    t: params.t,
                    filter: JSON.stringify(filter),
                    order: params.order
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
            clearMaterialData: function () {
                amount1 = 0;
                balanceAmount1 = 0;
                amount2 = 0;
                balanceAmount2 = 0;
                amount3 = 0;
                amount4 = 0;
                amount5 = 0;
                amount6 = 0;
                list1.length = 0;
                list2.length = 0;
                list3.length = 0;
                list4.length = 0;
                list5.length = 0;
                list6.length = 0;
            },
            getAmount1: function () {
                return amount1 / 10000;
            },
            getList1: function () {
                return list1;
            },
            getBalanceAmount1: function () {
                return balanceAmount1 / 10000;
            },
            getAmount2: function () {
                return amount2 / 10000;
            },
            getList2: function () {
                return list2;
            },
            getBalanceAmount2: function () {
                return balanceAmount2 / 10000;
            },
            getAmount3: function () {
                return amount3 / 10000;
            },
            getList3: function () {
                return list3;
            },
            getAmount4: function () {
                return amount4 / 10000;
            },
            getList4: function () {
                return list4;
            },
            getAmount5: function () {
                return amount5 / 10000;
            },
            getList5: function () {
                return list5;
            },
            getAmount6: function () {
                return amount6 / 10000;
            },
            getList6: function () {
                return list6;
            },
            getOrgId: function () {
                return orgId;
            },
            setOrgId: function (val) {
                orgId = val;
            }
        }
    }]);