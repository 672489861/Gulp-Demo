angular.module('app.safety.multipleCheck')
    .factory("multipleCheckListService", ['YTService', 'UserService','YTService', function (YT, userService,YTService) {
        var serviceData = [],
            pageIndex = 0,
            pageSize = 20,
            hasNextPage = true,
            condition={
                projectName:'',
                companyName:'',
                companyId:-1,
                statusId:0,
                statusName:''
            },
            companyList = [];
        return {
            loadListData: function (successCallback) {
                ++pageIndex;
                var self = this;
                YT.query({
                    data: self.getSearchData(),
                    successCallback: function (data) {
                        self.loadListDataCallback(data);
                        successCallback.call();
                    }
                });
            },

            loadListDataCallback: function (data) {
                var pageInfo = data.object;
                for (var i = 0; i < pageInfo.items.length; i++) {
                    serviceData.push(pageInfo.items[i]);
                }
                if(pageIndex >= pageInfo.pageCount) {
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
                serviceData = [];
                companyList = [];
            },

            resetCondition:function(){
                condition={
                    projectName:'',
                    companyName:'',
                    companyId:-1,
                    statusId:0,
                    statusName:''
                };
            },

            getSearchData: function () {
                var data = {
                    m: 15004,
                    t: 'v_safety_multiplecheck_list',
                    order: 'projectId',
                    page: pageIndex,
                    rows: pageSize
                };
                var filter = this.getSearchFilter();
                data.filter = JSON.stringify(filter);
                return data;
            },

            getSearchFilter: function () {
                var filter = [];
                var rootId = userService.getRootOrgId();
                if(condition.projectName != ''){
                    filter.push({field: 'projectName', value: '%'+condition.projectName+'%', operator: 'like', relation: 'AND'});
                }
                if(condition.statusId != 0){
                    if(condition.statusId == -1){
                        filter.push({field: 'editId', value: condition.statusId, operator: '=', relation: 'AND'});
                    }else if(condition.statusId == 1){
                        filter.push({field: 'editId', value: -1, operator: '<>', relation: 'AND'});
                    }
                }
                if(condition.companyId != -1){
                    filter.push({field: 'orgId', value: condition.companyId, operator: '=', relation: 'AND'});
                }
                if(userService.getTypeId() == 1){
                    YTService.getSubCompany(function(data){
                        companyList = data || [];
                        var innerFilter = [];
                        for(var i=0;i<companyList.length;i++){
                            innerFilter.push({field: 'orgId', value: companyList[i].id, operator: '=', relation: 'OR'});
                        }
                        if(innerFilter.length > 0){
                            filter.push(innerFilter);
                        }
                    });
                }else if(userService.getTypeId() == 2){
                    filter.push({field: 'orgId', value: rootId, operator: '=', relation: 'AND'});
                }

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
            getCompanyList: function(){
                return companyList;
            },
            getCondition:function(){
                return condition;
            },
            hasNextPage: function () {
                return hasNextPage;
            }
        };
    }]);
