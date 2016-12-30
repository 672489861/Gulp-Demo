angular.module('app.safety.multipleCheck')
    .factory("multipleCheckItemAddService",
        ['YTService', 'UserService','env','$ionicActionSheet','LocalStorageService','$ionicPopup',
            function (YT, userService,env,$ionicActionSheet,LocalStorageService,$ionicPopup) {
                var detailData={},
                    tempDetail={},
                    groupIdList = [],
                    groupDataMap = {},
                    groupDataList = [],
                    groupAttachMap = {},
                    structureType=[],
                    extraCheckerName = [],
                    spot=[],
                    editSpot=[],
                    positionList=[],
                    addPositionList=[],
                    position=[],
                    type='',
                    editId='',
                    projectId='';
                return{
                    clearCachedData: function () {
                        detailData={};
                        tempDetail={};
                        groupIdList = [];
                        groupDataMap = {};
                        groupDataList = [];
                        groupAttachMap = {};
                        structureType=[];
                        extraCheckerName = [];
                        spot=[];
                        editSpot=[];
                        positionList=[];
                        addPositionList=[];
                        position=[];
                        type='';
                        editId='';
                        projectId='';
                    },
                    queryDetailData:function(editId,projectId,successCallback){
                        var self = this;
                        var data = {};
                        if(editId != -1){
                            data = {
                                m: 15004,
                                t: 'v_safety_multiplecheck_extend'
                            };
                        }else{
                            data = {
                                m: 15004,
                                t: 'v_safety_multiplecheck_org_extend'
                            };

                        }
                        var filter = [{field: 'projectId', value: projectId, operator: '=', relation: ''}];
                        data.filter = JSON.stringify(filter);

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                detailData = data.object[0];
                                tempDetail = self.deepClone(data.object[0]);
                                self.initChecker();
                                self.setNowAsCheckDate();
                                successCallback.call();
                            }
                        });
                    },
                    queryEditDetailData:function(id,successCallback){
                        var self = this;
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
                                self.getEditExtraCheckerName(detailData.extraCheckerName);
                                tempDetail = self.deepClone(data.object[0]);
                                successCallback.call();
                            }
                        });
                    },
                    queryGroupData: function (editId, successCallback) {
                        var self = this;
                        var data = {
                            m: 15004,
                            t: 'v_safety_multiplecheck_checkgroup',
                            order: 'detailId'
                        };
                        var filter = [{field: 'id', value: editId, operator: '=', relation: 'and'}];
                        data.filter = JSON.stringify(filter);

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                self.setDataList(editId,data.object,function(){
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
                    queryStructureType:function(){
                        var data = {
                            m: 15004,
                            t: 'dictionary_structure',
                            order: 'id'
                        };

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                structureType = data.object;
                            }
                        });
                    },
                    querySpotContent:function(successCallback){
                        var data = {
                            m: 15004,
                            t: 'safety_d_spotcontent',
                            order: 'id'
                        };

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                if(data.object.length > 0){
                                    for(var i=0;i<data.object.length;i++){
                                        data.object[i].spotCheckId = -1;
                                        data.object[i].spotCheckName = '';
                                    }
                                }
                                successCallback.call(this,data.object);
                            }
                        });
                    },
                    queryEditSpotData:function(id){
                        var self = this;
                        var data = {
                            m: 15004,
                            t: 'v_safety_multiplecheck_spot',
                            order:'spotContentId'
                        };
                        var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                        data.filter = JSON.stringify(filter);

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                editSpot = data.object;
                                self.setEditSpot();
                            }
                        });
                    },
                    querySpotCheck:function(successCallback){
                        var data = {
                            m: 15004,
                            t: 'safety_d_spotcheck',
                            order: 'id'
                        };

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                successCallback.call(this,data.object);
                            }
                        });
                    },
                    queryCheckPosition:function(successCallback){
                        var data = {
                            m: 15004,
                            t: 'safety_d_checkposition',
                            order: 'id'
                        };
                        var filter = [{field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: 'and'}];
                        data.filter = JSON.stringify(filter);

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                positionList = data.object;
                                successCallback.call(this,data.object);
                            }
                        });
                    },
                    queryCheckContent:function(id,level,successCallback){
                        var data = {
                            m: 15004,
                            t: 'v_safety_checkcontent',
                            order: 'id'
                        };
                        var filter = [];

                        var oneFilter = [];
                        oneFilter.push({field: 'level', value: level, operator: '=', relation: 'and'});
                        if(id != -1){
                            oneFilter.push({field: 'pId', value: id, operator: '=', relation: 'and'});
                        }
                        oneFilter.push({field: 'type', value: '通用', operator: '=', relation: 'OR'});

                        var twoFilter = [];
                        twoFilter.push({field: 'level', value: level, operator: '=', relation: 'and'});
                        if(id != -1){
                            twoFilter.push({field: 'pId', value: id, operator: '=', relation: 'and'});
                        }
                        twoFilter.push({field: 'type', value: '项目部', operator: '=', relation: 'and'});
                        twoFilter.push({field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: ''});

                        filter.push(oneFilter);
                        filter.push(twoFilter);

                        data.filter = JSON.stringify(filter);
                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                successCallback.call(this, data.object);
                            }
                        });
                    },
                    insertCheckProblem:function(problem,successCallback){
                        var data = {
                            m: 15004,
                            t: 'safety_d_checkcontent_extend',             //table
                            v: JSON.stringify([{
                                t:'safety_d_checkcontent_extend',
                                data: problem,
                                ai: true
                            }])
                        };

                        YT.insert({
                            data: data,
                            successCallback: function (data) {
                                successCallback.call(this, data.object);
                            }
                        });
                    },
                    insertAddPosition:function(positionList,successCallback){
                        var data = {
                            m: 15004,
                            t: 'safety_d_checkposition',             //table
                            v: JSON.stringify(positionList)
                        };

                        YT.insert({
                            data: data,
                            successCallback: function (data) {
                                successCallback.call();
                            }
                        });
                    },
                    insertHistory:function(history,successCallback){
                        var data = {
                            m: 15004,
                            t: 'safety_multiplecheck_history',             //table
                            v: JSON.stringify([{
                                t:'safety_multiplecheck_history',
                                data: history,
                                ai: true
                            }])
                        };

                        YT.insert({
                            data: data,
                            successCallback: function (data) {
                                successCallback.call();
                            }
                        });
                    },
                    insertCheckData:function(data,slave,successCallback){
                        var postData = {
                            m: 15004,
                            t: 'safety_multiplecheck',             //table
                            v: JSON.stringify([{
                                t:'safety_multiplecheck',
                                data: data,
                                ai: true,
                                slave:slave
                            }])
                        };

                        YT.insert({
                            data: postData,
                            successCallback: function (data) {
                                successCallback.call(this, data);
                            }
                        });
                    },
                    updateCheckData:function(data,successCallback){
                        var filter = [
                            {field: 'id', value: data.mainData.id, operator: '=', relation: ''}
                        ];
                        var postData = {
                            m: 15004,
                            t: 'safety_multiplecheck',             //table
                            v: JSON.stringify([{
                                t:'safety_multiplecheck',
                                data: data.mainData,
                                slave:data.slave,
                                filter:filter
                            }]),
                            params: JSON.stringify(data.params)
                        };

                        YT.update({
                            data: postData,
                            successCallback: function (data) {
                                successCallback.call(this, data);
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
                                    var contentMap = self.getContent(contentData);
                                    var content = contentMap.content;
                                    var problems = contentMap.problems;
                                    groupDataList.push({
                                        groupId:groupIdList[j],
                                        checkPosName:checkPosName,
                                        attachList:groupAttachMap[groupIdList[j]]==undefined?[]:groupAttachMap[groupIdList[j]],
                                        content:content,
                                        problems:problems
                                    });
                                }
                            }
                            callback();
                        });
                    },
                    getContent:function(contentData){
                        var problemList = [];
                        var contentList = [];
                        var contentMap ={};
                        var itemMap ={};
                        var problemMap ={};
                        for(var i=0;i<contentData.length;i++){
                            contentMap[contentData[i].checkContentId] = {id:contentData[i].checkContentId,name:contentData[i].checkContentName,checked:true};
                            itemMap[contentData[i].checkItemId] = {id:contentData[i].checkItemId,name:contentData[i].checkItemName,pId:contentData[i].checkContentId,checked:true};
                            problemMap[contentData[i].checkProblemId] = {id:contentData[i].checkProblemId,name:contentData[i].checkProblemName,pId:contentData[i].checkItemId,contentId:contentData[i].checkContentId,checked:true};
                            problemList.push({id:contentData[i].checkProblemId,name:contentData[i].checkProblemName,pId:contentData[i].checkItemId,contentId:contentData[i].checkContentId,checked:true});
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
                        return {content:contentList,problems:problemList};
                    },
                    changeAttach : function(list){
                        if(list.length > 0 ){
                            for(var i=0;i<list.length;i++){
                                var ticket = userService.getTicket();
                                list[i].src = list[i].url.replace("\\", "/");
                                list[i].src = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + list[i].src;
                                list[i].data={
                                    name:list[i].name,
                                    url:list[i].url
                                };
                            }
                        }
                    },
                    prefixInteger : function (num, n) {
                        var len = num.toString().length;
                        while (len < n) {
                            num = "0" + num;
                            len++;
                        }
                        return num;
                    },
                    getStorageData:function(id,callBack){
                        var list = JSON.parse(LocalStorageService.get('multipleCheckList')) || [];
                        var data = {};
                        for(var i=0;i<list.length;i++){
                            if(list[i].id == id){
                                data = list[i];
                                break;
                            }
                        }
                        callBack(data);
                    },
                    setStorageData:function(data,callBack){
                        var list = JSON.parse(LocalStorageService.get('multipleCheckList')) || [];
                        for(var i=0;i<list.length;i++){
                            if(list[i].id == data.id){
                                list[i] = data;
                                break;
                            }
                        }
                        LocalStorageService.set('multipleCheckList',JSON.stringify(list));
                        callBack();
                    },
                    delStorageData:function(id,callBack){
                        var list = JSON.parse(LocalStorageService.get('multipleCheckList')) || [];
                        for(var i=0;i<list.length;i++){
                            if(list[i].id == id){
                                list.splice(i,1);
                                break;
                            }
                        }
                        LocalStorageService.set('multipleCheckList',JSON.stringify(list));
                        callBack();
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
                    getGroupDataList:function(){
                        return groupDataList;
                    },
                    getDetailData:function(){
                        return detailData;
                    },
                    getStructureType:function(){
                        return structureType;
                    },
                    getExtraCheckerName:function(){
                        return extraCheckerName;
                    },
                    getSpot:function(){
                        return spot;
                    },
                    getPositionList:function(){
                        return positionList;
                    },
                    getAddPositionList:function(){
                        return addPositionList;
                    },
                    getRootOrgId:function(){
                        return userService.getRootOrgId();
                    },
                    getTempDetail:function(){
                        return tempDetail;
                    },
                    setDetailData:function(data){
                        detailData = data;
                    },
                    initChecker:function(){
                        detailData.checkerId = userService.getUserId();
                        detailData.checkerName = userService.getUserName();
                        detailData.extraCheckerName = '';
                        detailData.allCheckerName = userService.getUserName();
                    },
                    setNowAsCheckDate:function(){
                        var self = this;
                        var now = new Date();
                        detailData.checkDate = now.getFullYear()+'-'+self.prefixInteger(now.getMonth()+1,2)+'-'+self.prefixInteger(now.getDate(),2);
                    },
                    setCheckDate:function(date){
                        detailData.checkDate = date;
                    },
                    setStartDate:function(date){
                        detailData.actualBeginDate = date;
                    },
                    setEndDate:function(date){
                        detailData.plannedEndDate = date;
                    },
                    setGroupList:function(data){
                        groupDataList = data;
                    },
                    setPersonInfo:function(data){
                        detailData.manager = data.manager;
                        detailData.managerTel = data.managerTel;
                        detailData.technician = data.technician;
                        detailData.technicianTel = data.technicianTel;
                        detailData.inspector = data.inspector;
                        detailData.inspectorTel = data.inspectorTel;
                        detailData.safetyOfficer = data.safetyOfficer;
                        detailData.safetyOfficerTel = data.safetyOfficerTel;
                    },
                    setProjectInfo:function(data){
                        detailData.areaOfStructure = data.areaOfStructure;
                        detailData.cost = data.cost;
                        detailData.groundLayer = data.groundLayer;
                        detailData.underGroundLayer = data.underGroundLayer;
                        detailData.personNumber = data.personNumber;
                    },
                    setStructureType:function(data){
                        detailData.structureTypeId = data.structureTypeId;
                        detailData.structureName = data.structureName;
                    },
                    setProjectStatus:function(data){
                        detailData.projectStatus = data.projectStatus;
                    },
                    setAdvice:function(data){
                        detailData.advice = data.advice;
                    },
                    setExtraCheckerName:function(data){
                        extraCheckerName = data;
                        var extraCheckerNameStr = '';
                        if(data.length > 0){
                            extraCheckerNameStr = data[0].name;
                            for(var i=1;i<data.length;i++){
                                extraCheckerNameStr += '，'+data[i].name;
                            }
                        }
                        detailData.extraCheckerName = extraCheckerNameStr;
                        if(extraCheckerNameStr != ''){
                            detailData.allCheckerName = detailData.checkerName +'，'+extraCheckerNameStr;
                        }else{
                            detailData.allCheckerName = detailData.checkerName;
                        }
                    },
                    getEditExtraCheckerName:function(str){
                        if(str != undefined && str != null && str !=''){
                            var list = str.split('，');
                            if(list.length > 0){
                                for(var i=0;i<list.length;i++){
                                    extraCheckerName.push({name:list[i]});
                                }
                            }
                        }
                    },
                    setEditSpot:function(){
                        if(editSpot.length >0){
                            for(var i=0;i<editSpot.length;i++){
                                spot.push({
                                    id:editSpot[i].spotContentId,
                                    code:editSpot[i].spotContentCode,
                                    name:editSpot[i].spotContentName,
                                    rowspan:editSpot[i].rowspan,
                                    spotCheckId:editSpot[i].spotCheckId,
                                    spotCheckName:editSpot[i].spotCheckName
                                });
                            }
                        }
                    },
                    setSpot:function(data){
                        spot = data;
                    },
                    setSpotCount:function(data){
                        detailData.spotCount = data;
                    },
                    setType:function(data){
                        type = data;
                    },
                    setImagList:function(index,list){
                        groupDataList[index].attachList = list;
                    },
                    setTempDetail:function(data){
                        tempDetail = data;
                    },
                    setEditId:function(data){
                        editId = data;
                    },
                    getEditId:function(){
                        return editId;
                    },
                    setProjectId:function(data){
                        projectId = data;
                    },
                    getProjectId:function(){
                        return projectId;
                    },
                    getType:function(){
                        return type;
                    },
                    setGroupProblems:function(index,data){
                        groupDataList[index].problems = data;
                    },
                    getGroupProblems:function(index){
                        return groupDataList[index].problems;
                    },
                    pushPosition:function(data){
                        position.push(data);
                    },
                    getPosition:function(){
                        return position;
                    },
                    setPosition:function(data){
                        position = data;
                    },
                    pushGroupData:function(position){
                        groupDataList.push({positionId:position.id,checkPosName:position.name,attachList:[],content:[]});
                    },
                    delGroupData:function(index){
                        if(position.length > 0){
                            for(var i=0;i<position.length;i++){
                                if(position[i].name == groupDataList[index].checkPosName){
                                    position.splice(i,1);
                                }
                            }
                        }
                        groupDataList.splice(index,1);
                    },
                    delContent:function(groupIndex,index){
                        var self = this;
                        self.removeContentProblems(groupIndex,groupDataList[groupIndex].content[index].id);
                        groupDataList[groupIndex].content.splice(index,1);
                    },
                    setContent:function(groupIndex,data){
                        groupDataList[groupIndex].content = data;
                    },
                    removeContent:function(groupIndex,id){
                        var self = this;
                        var content = groupDataList[groupIndex].content || [];
                        for(var i=0;i<content.length;i++){
                            if(content[i].id == id){
                                self.delContent(groupIndex,i);
                                break;
                            }
                        }
                    },
                    removeItem:function(groupIndex,contentId,itemId){
                        var content = groupDataList[groupIndex].content || [];
                        for(var i=0;i<content.length;i++){
                            if(contentId == content[i].id){
                                var items = content[i].items || [];
                                for(var j=0;j<items.length;j++){
                                    if(itemId = items[j].id){
                                        items.splice(j,1);
                                    }
                                }
                                groupDataList[groupIndex].content[i].items = items;
                            }
                        }
                    },
                    removeContentProblems:function(groupIndex,contentId){
                        var problems = groupDataList[groupIndex].problems || [];
                        var tempProblems = [];
                        for(var i=0;i<problems.length;i++){
                            var flag = true;
                            if(problems[i].contentId == contentId){
                                flag = false;
                            }
                            if(flag){
                                tempProblems.push(problems[i]);
                            }
                        }
                        groupDataList[groupIndex].problems = tempProblems;
                    },
                    pushProblem:function(groupIndex,data){
                        groupDataList[groupIndex].problems.push(data);
                    },
                    removeItemProblems:function(groupIndex,pId){
                        var returnProblems = [];
                        var problems = groupDataList[groupIndex].problems || [];
                        for(var i=0;i<problems.length;i++){
                            if(problems[i].pId != pId){
                                returnProblems.push(problems[i]);
                            }
                        }
                        groupDataList[groupIndex].problems = returnProblems;
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
                    validateDate:function(startDate,endDate){
                        var flag = true;
                        if (startDate && endDate) {
                            var beginTimes = startDate.substring(0, 10).split('-');
                            var endTimes = endDate.substring(0, 10).split('-');
                            var beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + startDate.substring(10, 19);
                            var endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endDate.substring(10, 19);
                            var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
                            if (a < 0) {
                                flag = false;
                                $ionicPopup.alert({
                                    title: '提示',
                                    template: '开工时间不能大于完工时间！'
                                });
                            }
                        }else{
                            flag = false;
                        }
                        return flag;
                    }
                }
            }])
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });
