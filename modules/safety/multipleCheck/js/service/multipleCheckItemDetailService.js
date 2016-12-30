angular.module('app.safety.multipleCheck')
    .factory("multipleCheckItemDetailService",
        ['YTService', 'UserService','env',
            function (YT, userService,env) {
                var detailData={},
                    groupIdList = [],
                    groupDataMap = {},
                    groupDataList = [],
                    groupAttachMap = {};
                return{
                    clearCachedData: function () {
                        detailData={};
                        groupIdList = [];
                        groupDataMap = {};
                        groupDataList = [];
                        groupAttachMap = {};
                    },
                    queryDetailData:function(id,successCallback){
                        var data = {
                            m: 15004,
                            t: 'v_safety_multiplecheck'
                        };
                        var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                        data.filter = JSON.stringify(filter);

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                detailData = data.object[0];
                                successCallback.call();
                            }
                        });
                    },
                    queryDetailGroupData: function (id, successCallback) {
                        var self = this;
                        var data = {
                            m: 15004,
                            t: 'v_safety_multiplecheck_checkgroup',
                            order: 'detailId'
                        };
                        var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                        data.filter = JSON.stringify(filter);

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                self.setDataList(id,data.object,function(){
                                    successCallback.call();
                                });
                            }
                        });
                    },
                    queryDetailAttach:function(checkId,successCallback){
                        var data = {
                            m: 15004,
                            t: 'v_safety_multiplecheck_checkgroup_attach',
                            order: 'attachId'
                        };
                        var filter = [{field: 'checkId', value: checkId, operator: '=', relation: 'and'}];
                        data.filter = JSON.stringify(filter);

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                successCallback.call(this,data.object);
                            }
                        });
                    },
                    checkGroupId:function(groupId){
                        var flag = false;
                        if(groupIdList.length > 0){
                            for(var i=0;i<groupIdList.length;i++){
                                if(groupIdList[i] == groupId ){
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        return flag;
                    },
                    pushGroupId:function(groupId){
                        var self = this;
                        if(!self.checkGroupId(groupId)){
                            groupIdList.push(groupId);
                            self.sortGroupIdList();
                        }
                    },
                    sortGroupIdList:function(){
                        groupIdList.sort(function(a,b){
                            return a-b;
                        });
                    },
                    pushGroupItem:function(groupItem){
                        var self = this;
                        var groupId = groupItem.groupId;
                        self.pushGroupId(groupId);
                        var items = groupDataMap[groupId];
                        if(items != undefined && items != null && items.length >0){
                            items.push(groupItem);
                        }else{
                            var tempItems = [];
                            tempItems.push(groupItem);
                            groupDataMap[groupId] =tempItems;
                        }
                    },
                    setGroupAttachMap:function(attachList){
                        var self = this;
                        self.changeAttach(attachList);
                        if(attachList.length >0){
                            for(var j=0;j<attachList.length;j++){
                                var temp = groupAttachMap[attachList[j].id];
                                if(temp !=undefined && temp != null && temp.length > 0){
                                    temp.push(attachList[j]);
                                }else{
                                    var temps = [];
                                    temps.push(attachList[j]);
                                    temp = temps;
                                }
                                groupAttachMap[attachList[j].id] = temp;
                            }
                        }
                    },
                    setDataList:function(id,groupData,callback){
                        var self = this;
                        self.queryDetailAttach(id,function(attachData){
                            if(groupData.length > 0){
                                for(var i=0;i<groupData.length;i++){
                                    self.pushGroupItem(groupData[i]);
                                }
                            }
                            self.setGroupAttachMap(attachData);
                            if(groupIdList.length >0){
                                groupDataList = [];
                                for(var j=0;j<groupIdList.length;j++){
                                    var contentData = groupDataMap[groupIdList[j]];
                                    var checkPosName = contentData[0].checkPosName;
                                    var content = self.getContent(contentData);
                                    groupDataList.push({groupId:groupIdList[j],checkPosName:checkPosName,attachList:groupAttachMap[groupIdList[j]]==undefined?[]:groupAttachMap[groupIdList[j]],content:content});
                                }
                            }
                            callback();
                        });
                    },
                    getContent:function(contentData){
                        var contentList = [];
                        var contentMap ={};
                        var itemMap ={};
                        var problemMap ={};
                        for(var i=0;i<contentData.length;i++){
                            contentMap[contentData[i].checkContentId] = {id:contentData[i].checkContentId,name:contentData[i].checkContentName};
                            itemMap[contentData[i].checkItemId] = {id:contentData[i].checkItemId,name:contentData[i].checkItemName,pId:contentData[i].checkContentId};
                            problemMap[contentData[i].checkProblemId] = {id:contentData[i].checkProblemId,name:contentData[i].checkProblemName,pId:contentData[i].checkItemId,contentId:contentData[i].checkContentId};
                        }

                        for(var key in problemMap){
                            var problems = itemMap[problemMap[key].pId].problems;
                            problems = problems || [];
                            problems.push(problemMap[key]);
                            itemMap[problemMap[key].pId].problems = problems;
                        }

                        for(var key in itemMap){
                            var items = contentMap[itemMap[key].pId].items;
                            items = items || [];
                            items.push(itemMap[key]);
                            contentMap[itemMap[key].pId].items = items;
                        }

                        for(var key in contentMap){
                            contentList.push(contentMap[key]);
                        }
                        return contentList;
                    },
                    changeAttach : function(list){
                        if(list.length > 0 ){
                            for(var i=0;i<list.length;i++){
                                var ticket = userService.getTicket();
                                list[i].src = list[i].url.replace("\\", "/");
                                list[i].src = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + list[i].src;
                            }
                        }
                    },
                    getGroupDataList:function(){
                        return groupDataList;
                    },
                    getDetailData:function(){
                        return detailData;
                    }
                }
            }]);
