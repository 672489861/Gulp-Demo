angular.module('app.frame.dashboard')
    .factory("DeviceService", ['YTService', 'UserService', function (YT, userService) {

        var orgId = 0, ownDetailList = [], rentList = [], purchaseList = [], outCompanyList = [];

        return {
            loadData: function (callback) {
                var self = this;
                self.clearData();

                self.setOwnDevice(function () {
                    self.setRentDevice(function () {
                        self.setPurchaseDevice(function () {
                            self.setOutCompanyDevice(function () {
                                callback.call();
                            });
                        });
                    });
                });
            },
            clearData: function () {
                ownDetailList.length = 0;
                rentList.length = 0;
                purchaseList.length = 0;
                outCompanyList.length = 0;
            },
            setOwnDevice: function (callback) {
                var params = {
                    sourceId: 1,
                    order: 'id asc'
                };

                this.ajax(params, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var deviceName = data[i].number;
                        ownDetailList.push({
                            deviceName: deviceName
                        });
                    }

                    callback();
                });
            },
            setRentDevice: function (callback) {
                var params = {
                    sourceId: 2,
                    order: 'supplierId asc'
                };

                this.ajax(params, function (data) {
                    var rentDetailList = [];
                    for (var i = 0; i < data.length; i++) {
                        var rentId = data[i].supplierId;
                        var rentName = data[i].supplierName;
                        var deviceName = data[i].number;
                        if (i == 0) {
                            rentDetailList.push({
                                deviceName: deviceName
                            });

                            rentList.push({
                                rentId: rentId,
                                rentName: rentName,
                                detail: rentDetailList
                            });
                        } else {
                            var rentIdBef = data[i - 1].supplierId;

                            if (rentId != rentIdBef) {
                                rentList[rentList.length - 1].detail = rentDetailList;
                                rentDetailList = [];

                                rentList.push({
                                    rentId: rentId,
                                    rentName: rentName
                                });
                            }

                            rentDetailList.push({
                                deviceName: deviceName
                            });

                            if (i == data.length - 1) {
                                rentList[rentList.length - 1].detail = rentDetailList;
                            }
                        }
                    }

                    callback();
                });
            },
            setPurchaseDevice: function (callback) {
                var params = {
                    sourceId: 4,
                    order: 'supplierId asc'
                };

                this.ajax(params, function (data) {
                    var purchaseDetailList = [];
                    for (var i = 0; i < data.length; i++) {
                        var purchaseId = data[i].supplierId;
                        var purchaseName = data[i].supplierName;
                        var deviceName = data[i].number;
                        if (i == 0) {
                            purchaseDetailList.push({
                                deviceName: deviceName
                            });

                            purchaseList.push({
                                rentId: purchaseId,
                                rentName: purchaseName,
                                detail: purchaseDetailList
                            });
                        } else {
                            var purchaseIdBef = data[i - 1].supplierId;

                            if (purchaseId != purchaseIdBef) {
                                purchaseList[purchaseList.length - 1].detail = purchaseDetailList;
                                purchaseDetailList = [];

                                purchaseList.push({
                                    rentId: purchaseId,
                                    rentName: purchaseName
                                });
                            }

                            purchaseDetailList.push({
                                deviceName: deviceName
                            });

                            if (i == data.length - 1) {
                                purchaseList[purchaseList.length - 1].detail = purchaseDetailList;
                            }
                        }
                    }

                    callback();
                });
            },
            setOutCompanyDevice: function (callback) {
                var params = {
                    sourceId: 6,
                    order: 'merchantId asc'
                };

                this.ajax(params, function (data) {
                    var outCompanyDetailList = [];
                    for (var i = 0; i < data.length; i++) {
                        var merchantId = data[i].merchantId;
                        var merchantName = data[i].merchantName;
                        var deviceName = data[i].number;
                        if (i == 0) {
                            outCompanyDetailList.push({
                                deviceName: deviceName
                            });

                            outCompanyList.push({
                                rentId: merchantId,
                                rentName: merchantName,
                                detail: outCompanyDetailList
                            });
                        } else {
                            var merchantIdBef = data[i - 1].merchantId;

                            if (merchantId != merchantIdBef) {
                                outCompanyList[outCompanyList.length - 1].detail = outCompanyDetailList;
                                outCompanyDetailList = [];

                                outCompanyList.push({
                                    rentId: merchantId,
                                    rentName: merchantName
                                });
                            }

                            outCompanyDetailList.push({
                                deviceName: deviceName
                            });

                            if (i == data.length - 1) {
                                outCompanyList[outCompanyList.length - 1].detail = outCompanyDetailList;
                            }
                        }
                    }

                    callback();
                });
            },
            ajax: function (params, callback) {
                var filter = [
                    {field: 'orgId', value: orgId, operator: '=', relation: 'AND'},
                    {field: 'sourceId', value: params.sourceId, operator: '=', relation: 'AND'},
                    {field: 'outtime', value: 'null', operator: 'is', relation: 'AND'}
                ];

                var data = {
                    m: 1005,
                    t: 'v_deviceinfo_list',
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
            getOrgId: function () {
                return orgId;
            },
            setOrgId: function (val) {
                orgId = val;
            },
            getOwnDevice: function () {
                return ownDetailList;
            },
            getRentDevice: function () {
                return rentList
            },
            getPurchaseDevice: function () {
                return purchaseList;
            },
            getOutCompanyDevice: function () {
                return outCompanyList;
            }
        }
    }]);