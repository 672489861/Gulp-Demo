angular.module('app.device.maintain.maintain-record')
    .factory("MaintainRecordService",['YTService','UserService',function(YT,userService){
        var recordList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition={};
        return{
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

            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    recordList.push(pageInfo.items[i]);
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
                this.clearCachedData();
                this.loadListData(successCallBack);
            },

            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                recordList = [];
            },

            getSearchData: function () {
                var data = {
                    m: 12003002003,
                    t: 'v_device_maintain_record',
                    page: pageIndex,
                    rows: pageSize
                };

                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },

            getSearchFilter: function () {
                var filter = [{field:'orgId',value:userService.getRootOrgId(),operator:'=',relation:'AND'}];
                return filter;
            },
            getDeviceRecordDetail: function (id, successCallback) {
                var data = {
                    m: 12003002003,
                    t: 'v_device_maintain_record'
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

            getAttaches:function (id,callback) {
                var filter = [{field:'id',value:id,operator:'=',relation:'and'}];
                YT.query({
                    data:{m:12003002002,t:'device_maintain_attach',order:'typeId',filter:JSON.stringify(filter)},
                    successCallback:function (data) {
                        callback(data.object);
                    }
                })
            },
            resetCondition: function () {
                condition = {};
            },
            getRecordList: function () {
                return recordList;
            },

            hasNextPage: function () {
                return hasNextPage;
            },
            getCondition: function () {
                return condition;
            }

        };
    }]);