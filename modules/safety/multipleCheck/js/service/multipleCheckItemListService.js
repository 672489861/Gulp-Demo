angular.module('app.safety.multipleCheck')
    .factory("multipleCheckItemListService", ['YTService','LocalStorageService', function (YT,LocalStorageService) {
        var serviceData = [],
            pageIndex = 0,
            pageSize = 10,
            hasNextPage = true,
            right = {
                checker:false
            },
            serviceDataMap = {},
            months = [],
            editId='',
            projectId='';
        return {
            loadListData: function (projectId,successCallback) {
                ++pageIndex;
                var self = this;
                right.checker = YT.haveRight(15004);
                YT.query({
                    data: self.getSearchData(projectId),
                    successCallback: function (data) {
                        self.loadListDataCallback(data);
                        successCallback.call();
                    }
                });

            },

            loadListDataCallback: function (data) {
                var self = this;
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    var temp = pageInfo.items[i].projectStatus;
                    if(temp == undefined || temp == null || temp == ''){
                        pageInfo.items[i].projectStatus = '未填写';
                    }
                    self.pushItem(pageInfo.items[i]);
                }
                self.setServiceData();
                //pageInfo.pageCount确定页数
                if (pageIndex >= pageInfo.pageCount) {
                    hasNextPage = false;
                } else {
                    hasNextPage = true;
                }
            },
            //刷新
            refreshListData: function (projectId,successCallBack) {
                this.clearCachedData();
                this.loadListData(projectId,successCallBack);
            },

            clearCachedData: function () {
                pageIndex = 0;
                hasNextPage = true;
                serviceData = [];
                serviceDataMap = {};
                months = [];
            },

            getSearchData: function (projectId) {
                var data = {
                    m: 15004,
                    t: 'v_safety_multiplecheck',
                    order: 'id desc',
                    page: pageIndex,
                    rows: pageSize
                };
                var filter = this.getSearchFilter(projectId);
                data.filter = JSON.stringify(filter);
                return data;
            },

            getSearchFilter: function (projectId) {
                var filter = [];
                filter.push({field: 'projectId', value: projectId, operator: '=', relation: 'AND'});
                return filter;
            },
            deepClone:function (obj){
                var o;
                switch(typeof obj){
                    case 'undefined': break;
                    case 'string'   : o = obj + '';break;
                    case 'number'   : o = obj - 0;break;
                    case 'boolean'  : o = obj;break;
                    case 'object'   :
                        if(obj === null){
                            o = null;
                        }else{
                            if(obj instanceof Array){
                                o = [];
                                for(var i = 0, len = obj.length; i < len; i++){
                                    o.push(this.deepClone(obj[i]));
                                }
                            }else{
                                o = {};
                                for(var k in obj){
                                    o[k] = this.deepClone(obj[k]);
                                }
                            }
                        }
                        break;
                    default:
                        o = obj;break;
                }
                return o;
            },
            getServiceData: function () {
                return serviceData;
            },
            hasNextPage: function () {
                return hasNextPage;
            },
            getRight:function(){
                return right;
            },
            checkMonths:function(month){
                var flag = false;
                if(months.length > 0){
                    for(var i=0;i<months.length;i++){
                        if(months[i] == month ){
                            flag = true;
                            break;
                        }
                    }
                }
                return flag;
            },
            pushMonth:function(month){
                var self = this;
                if(!self.checkMonths(month)){
                    months.push(month);
                    self.sortMonths();
                }
            },
            sortMonths:function(){
                months.sort(function(a,b){
                    return b.localeCompare(a);
                });
            },
            pushItem:function(item){
                var self = this;
                var month = item.checkDate.substr(0,7);
                self.pushMonth(month);
                var items = serviceDataMap[month];
                if(items != undefined && items != undefined && items.length >0){
                    items.push(item);
                }else{
                    var tempItems = [];
                    tempItems.push(item);
                    serviceDataMap[month] =tempItems;
                }
            },
            getStorageList:function(projectId){
                var list = JSON.parse(LocalStorageService.get('multipleCheckList')) || [];
                var data = [];
                for(var i=0;i<list.length;i++){
                    if(list[i].detailData.projectId == projectId){
                        data.push(list[i]);
                    }
                }
                return data;
            },
            setServiceData:function(){
                serviceData = [];
                if(months.length > 0){
                    for(var i=0;i<months.length;i++){
                        serviceData.push({checkMonth:months[i],items:serviceDataMap[months[i]]});
                    }
                }
            },
            setEditId:function(data){
                editId = data;
            },
            getEditId :function(){
                return editId;
            },
            setProjectId:function(data){
                projectId = data;
            },
            getProjectId:function(){
                return projectId;
            }
        };
    }])
    .filter('changeDateToYearMonth', function () {
        return function (str) {
            if(str != undefined && str != null && str != ''){
                var year = parseInt(str.substr(0,4));
                var month = parseInt(str.substr(5,2));
                return year +'年'+month +'月';
            }

        }
    });
