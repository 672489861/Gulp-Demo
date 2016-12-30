angular.module('app.merchant.information')
    .factory("MerchantService", ['YTService', 'UserService', function (YT, userService) {
        var merchantList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition = {
                //客商类型（1：建设单位 2：分包单位 3：材料供应商 4：设备供应商 5：其他客商）
                typeId: 0,
                //客商种类（1老证书2三证合一）
                kindId: 0,
                //客商编号
                number: "",
                //客商名称
                name: "",
                //身份证号
                idCard: "",
                //组织机构代码
                code: "",
                //统一社会信息代码
                unifiedSocialCode: ""
            };

        return {
            //加载客商列表数据
            loadListData: function (successCallback) {
                ++pageIndex;
                var self = this;
                YT.query({
                    data: self.getSearchData(),
                    successCallback: function (data) {
                        self.loadListDataCallback(data);
                        //successCallback();
                        successCallback.call();
                    }
                });
            },
            //加载数据返回
            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    merchantList.push(pageInfo.items[i]);
                }
                //pageInfo.pageCount确定页数
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            //刷新
            refreshListData: function (successCallBack) {
                //this.resetCondition();
                this.clearCachedData();
                this.loadListData(successCallBack);
            },
            //清除数据
            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                merchantList = [];
            },
            //获取查询数据
            getSearchData: function () {
                var typeId = userService.getTypeId();
                var rootId = userService.getRootOrgId();
                var userId = userService.getUserId();
                var data = {
                    m: 4001,
                    t: 'v_merchant_list',
                    order: 'time desc',
                    page: pageIndex,
                    rows: pageSize
                };
                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },
            //获取查询条件
            getSearchFilter: function () {
                var rootId = userService.getRootOrgId();
                var filter = [{field: 'orgId', value: rootId, operator: '=', relation: 'and'}];
                if (condition.typeId != 0) {
                    filter.push({field: 'typeId', value: condition.typeId, operator: '=', relation: 'and'});
                }
                if (condition.kindId != 0) {
                    filter.push({field: 'kindId', value: condition.kindId, operator: '=', relation: 'and'});
                }
                if (condition.number != '') {
                    filter.push({field: 'number', value: '%'+condition.number+'%', operator: 'like', relation: 'and'});
                }
                if (condition.name != '') {
                    filter.push({field: 'name', value: '%'+condition.name+'%', operator: 'like', relation: 'and'});
                }
                if (condition.idCard != '') {
                    filter.push({field: 'idCard', value: '%'+condition.idCard+'%', operator: 'like', relation: 'and'});
                }
                if (condition.code != '') {
                    filter.push({field: 'code', value: '%'+condition.code+'%', operator: 'like', relation: 'and'});
                }
                if (condition.unifiedSocialCode != '') {
                    filter.push({field: 'unifiedSocialCode', value: condition.unifiedSocialCode, operator: 'like', relation: 'and'});
                }
                return filter;
            },
            //获取客商详细
            getMerchantDetail: function (id, successCallback) {
                var data = {
                    m: 4001,
                    t: 'v_merchant_list'
                };
                var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback.call(this, data.object[0]);
                    }
                });
            },
            //获取客商基础信息附件
            getMerchantBaseAttachDetail: function (id, successCallback) {
                var data = {
                    m: 4001,
                    t: 'merchant_baseinfo_attach'
                };
                var filter = [
                    {field: 'id', value: id, operator: '=', relation: 'and'}
                ];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback.call(this, data.object);
                    }
                });
            },
            //获取客商资质信息详细
            getMerchantQualificationDetail: function (id, successCallback) {
                var data = {
                    m: 4001,
                    t: 'v_merchant_qualification_detail'
                };
                var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback.call(this, data.object);
                    }
                });
            },
            //获取客商安全证书信息详细
            getMerchantSafetyPermitDetail: function (id, successCallback) {
                var data = {
                    m: 4001,
                    t: 'v_merchant_safetypermit_detail'
                };
                var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback.call(this, data.object);
                    }
                });
            },
            //获取客商详细
            getMerchantTypeDetail: function (successCallback) {
                var data = {
                    m: 4001,
                    t: 'merchant_d_type'
                };

                YT.query({
                    data: data,
                    successCallback: function (data) {
                        successCallback.call(this, data.object);
                    }
                });
            },
            //初始化条件
            resetCondition: function () {
                //客商类型（1：建设单位 2：分包单位 3：材料供应商 4：设备供应商 5：其他客商）
                condition.typeId = 0;
                //客商种类（1老证书2三证合一）
                condition.kindId = 0;
                //客商编号
                condition.number = "";
                //客商名称
                condition.name = "";
                //身份证号
                condition.idCard = "";
                //组织机构代码
                condition.code = "";
                //统一社会信息代码
                condition.unifiedSocialCode = "";
            },
            //获取客商列表
            getMerchantList: function () {
                return merchantList;
            },
            //判断是否有下一页
            hasNextPage: function () {
                return hasNextPage;
            },
            //获取条件
            getCondition: function () {
                return condition;
            },
            downloadAttach:function (attach) {
                YT.download(attach);
            }
        };
    }]);
