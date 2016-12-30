angular.module('app.device.information')
    .factory("InformationService",['YTService','UserService',function(YT,userService){
        var deviceInfoList = [],
            supplyList = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            condition = {
                //设备状态
                statusId:-1,
                //设备名称
                name:'',
                //设备编号
                number:'',
                //设备类别
                categoryId:-1,
                //设备来源
                sourceId:-1,
                //设备标识
                identifyId:-1,
                //设备提供单位
                provideOrgId:-1,
                //供应商
                supplierId:-1,
                //进场时间（起）
                startTime:'',
                //进场时间结束
                endTime:''
            };
        return{
            clearSearchText: function () {
                condition = {
                    //设备状态
                    statusId:-1,
                    //设备名称
                    name:'',
                    //设备编号
                    number:'',
                    //设备类别
                    categoryId:-1,
                    //设备来源
                    sourceId:-1,
                    //设备标识
                    identifyId:-1,
                    //设备提供单位
                    provideOrgId:-1,
                    //供应商
                    supplierId:-1,
                    //进场时间（起）
                    startTime:'',
                    //进场时间结束
                    endTime:''
                };
            },
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
                    deviceInfoList.push(pageInfo.items[i]);
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
                this.clearSearchText();
                this.loadListData(successCallBack);
            },

            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                deviceInfoList = [];
            },

            //获取供应商列表
            getDeviceSupply:function(callback){
                YT.query({
                    data:{
                        m:12001,
                        t:'v_device_marchant_list',
                        filter:JSON.stringify([
                            {field: 'typeId', value:'4', operator: '=', relation: 'AND'},
                            {field: 'orgId', value:userService.getRootOrgId(), operator: '=', relation: 'AND'}
                        ])
                    },
                    successCallback: function (data) {
                        callback(data.object);
                    }
                });
            },

            //获取提供单位数据
            getProvideList:function(callback){
                YT.getSubProjectByProjectId(function(data){
                    for(var i = 0; i < data.length;i++) {
                        if(data[i].id == userService.getRootOrgId()) {
                            data.splice(i,1);
                        }
                    }
                    callback(data)
                });
            },

            getSearchData: function () {
                var data = {
                    m: 12001,
                    t: 'v_deviceinfo_list',
                    order: 'intime desc',
                    page: pageIndex,
                    rows: pageSize
                };

                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },

            getSearchFilter: function () {
                var filter = [{field:'orgId',value:userService.getRootOrgId(),operator:'=',relation:'AND'}];

                if (condition.statusId != -1) {
                    filter.push({field: 'statusId', value: condition.statusId, operator: '=', relation: 'AND'});
                }

                if(condition.name !='' && condition.name !='请输入设备名称'){
                    filter.push({field: 'name', value: condition.name, operator: '=', relation: 'AND'});
                }
                if(condition.number !='' && condition.number !='请输入设备名称'){
                    filter.push({field: 'number', value: condition.number, operator: '=', relation: 'AND'});
                }
                //设备大类别
                if(condition.categoryId !=-1){
                    filter.push({field: 'categoryId', value: condition.categoryId, operator: '=', relation: 'AND'});
                }
                //设备来源
                if(condition.sourceId !=-1){
                    filter.push({field: 'sourceId', value: condition.sourceId, operator: '=', relation: 'AND'});
                }
                //设备标识
                if(condition.identifyId !=-1){
                    filter.push({field: 'identifyId', value: condition.identifyId, operator: '=', relation: 'AND'});
                }
                //设备提供单位
                if(condition.provideOrgId !=-1){
                    filter.push({field: 'provide', value: condition.provideOrgId, operator: '=', relation: 'AND'});
                }
                //设备供应商
                if(condition.supplierId !=-1){
                    filter.push({field: 'supplierId', value: condition.supplierId, operator: '=', relation: 'AND'});
                }

                //时间过滤
                if (condition.startTime != '' && condition.endTime != '') {
                    filter.push([
                        {field: 'intime', value: condition.startTime, operator: '>=', relation: 'AND'},
                        {field: 'intime', value: condition.endTime, operator: '<=', relation: 'AND'}]);
                } else if (condition.startTime != '') {
                    filter.push(
                        {field: 'intime', value: condition.startTime, operator: '>=', relation: 'AND'});
                } else if (condition.endTime != '') {
                    filter.push(
                        {field: 'intime', value: condition.endTime, operator: '<=', relation: 'AND'});
                }

                return filter;
            },
            getDeviceInfoDetail: function (id, successCallback) {
                var data = {
                    m: 12001,
                    t: 'v_deviceinfo_list'
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

            resetCondition: function () {
                condition = {
                    statusId: -1,
                    //设备名称
                    name:'',
                    //设备编号
                    number:'',
                    //设备类别
                    categoryId:-1,
                    //设备来源
                    sourceId:-1,
                    //设备标识
                    identifyId:-1,
                    //设备提供单位
                    provideOrgId:-1,
                    //供应商
                    supplierId:-1,
                    //进场时间（起）
                    startTime:'',
                    //进场时间结束
                    endTime:''
                }
            },
            getDictionary:function (t,callback) {
                YT.query({
                    data:{m:12001,t:t},
                    successCallback:function (data) {
                        callback(data.object);
                    }
                });
            },
            getSources:function (callback) {
                this.getDictionary("device_d_source",callback);
            },
            getCategories:function (callback) {
                this.getDictionary('device_d_category',callback);
            },
            getIdentities:function (callback) {
                this.getDictionary('device_d_identify',callback);  
            },
            getStatuses:function (callback) {
                this.getDictionary('device_d_status',callback);
            },
            getDeviceInfoList: function () {
                return deviceInfoList;
            },
            getDeviceSupplyList:function(){
                return supplyList;
            },
            hasNextPage: function () {
                return hasNextPage;
            },

            getCondition: function () {
                return condition;
            }

        };
    }]);