angular.module('app.quality.check')
    .factory("qualityCheckAddService", ['YTService', 'UserService','LocalStorageService','env',
        function (YT, userService,LocalStorageService,env) {

            var checkData = {
                    title: "",
                    checkDate: "",
                    checkPosName:"",
                    solverId: -1,
                    statusId: -1
                },
                checkDataShow = {
                    checker:"",
                    checkPositionName :"",
                    solverName:"",
                    addPositionName:[],
                    hasProblem:true
                },
                content=[],
                problems=[],
                position=[],
                solver=[],
                image_list=[],
                type ="",
                id=-1;
            return {
                clearCachedData:function(){
                    checkData = {
                        title: "",
                        checkDate: "",
                        checkPosName:"",
                        solverId: -1,
                        statusId: -1
                    };
                    checkDataShow = {
                        checker:"",
                        checkPositionName :"",
                        solverName:"",
                        addPositionName:[],
                        hasProblem:true
                    };
                    content=[];
                    problems=[];
                    solver=[];
                    position=[];
                    image_list=[];
                    type ="";
                    id=-1;
                },
                queryDetail:function(id,successCallback){
                    var self = this;
                    self.setId(id);
                    var data = {
                        m: 16001002,
                        t: 'v_quality_qualitycheck'
                    };
                    var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                    data.filter = JSON.stringify(filter);

                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            var detail = data.object[0];
                            checkData = {
                                title: detail.title,
                                checkDate: detail.checkDate,
                                checkPosName: detail.checkPosName,
                                solverId: detail.solverId,
                                statusId: detail.statusId
                            };
                            checkDataShow = {
                                checker:detail.checkerName,
                                checkPositionName :detail.checkPosName,
                                solverName:detail.solverName,
                                addPositionName:[],
                                hasProblem:detail.hasProblem !=0
                            };
                            self.setCheckData(checkData);
                            self.setCheckDataShow(checkDataShow);
                            successCallback.call();
                        }
                    });
                },
                queryDetailContent:function(id,successCallback){
                    var self = this;
                    var data = {
                        m: 16001002,
                        t: 'v_quality_qualitycheck_detail'
                    };
                    var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                    data.filter = JSON.stringify(filter);

                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            var contentData = data.object;
                            var contentList = [];
                            var problemList = [];
                            var contentMap ={};
                            var problemMap ={};
                            for(var i=0;i<contentData.length;i++){
                                contentMap[contentData[i].checkContentId] = {id:contentData[i].checkContentId,name:contentData[i].checkContentName,checked:true};
                                problemMap[contentData[i].checkProblemId] = {id:contentData[i].checkProblemId,name:contentData[i].checkProblemName,pId:contentData[i].checkContentId,checked:true};
                                problemList.push({id:contentData[i].checkProblemId,name:contentData[i].checkProblemName,pId:contentData[i].checkContentId,checked:true});
                            }

                            for(var key in problemMap){
                                var problems = contentMap[problemMap[key].pId].problems;
                                problems = problems || [];
                                problems.push(problemMap[key]);
                                contentMap[problemMap[key].pId].problems = problems;
                            }

                            for(var key in contentMap){
                                contentList.push(contentMap[key]);
                            }
                            self.setContent(contentList);
                            self.setProblems(problemList);
                            successCallback.call();
                        }
                    });
                },
                queryAttach:function(id,successCallback){
                    var self = this;
                    var data = {
                        m: 16001002,
                        t: 'quality_qualitycheck_attach'
                    };
                    var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                    data.filter = JSON.stringify(filter);

                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            self.changeAttach(data.object);
                            successCallback.call();
                        }
                    });
                },
                querySolver:function(successCallback){
                    var data = {
                        m: 16001002,
                        t: 'v_quality_projectperson'
                    };
                    var filter = [];
                    filter.push({field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: 'and'});
                    filter.push({field: 'position', value: '处理人', operator: '=', relation: 'and'});
                    data.filter = JSON.stringify(filter);

                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            successCallback.call(this, data.object);
                        }
                    });
                },
                queryCheckContent:function(id,level,successCallback){
                    var data = {
                        m: 16001002,
                        t: 'v_quality_checkcontent',
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
                        m: 16001002,
                        t: 'quality_d_checkcontent_extend',             //table
                        v: JSON.stringify([{
                            t:'quality_d_checkcontent_extend',
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
                insertQualityCheckData:function(data,slave,params,successCallback){
                    var postData = {
                        m: 16001002,
                        t: 'quality_qualitycheck',             //table
                        v: JSON.stringify([{
                            t:'quality_qualitycheck',
                            data: data,
                            ai: true,
                            slave:slave
                        }]),
                        params: JSON.stringify(params)
                    };

                    YT.insert({
                        data: postData,
                        successCallback: function (data) {
                            successCallback.call(this, data);
                        }
                    });
                },
                updateQualityCheckData:function(data,slave,params,successCallback){
                    var filter = [
                        {field: 'id', value: data.id, operator: '=', relation: ''}
                    ];
                    var postData = {
                        m: 16001002,
                        t: 'quality_qualitycheck',             //table
                        v: JSON.stringify([{
                            t:'quality_qualitycheck',
                            data: data,
                            slave:slave,
                            filter:filter
                        }]),
                        params: JSON.stringify(params)
                    };

                    YT.update({
                        data: postData,
                        successCallback: function (data) {
                            successCallback.call(this, data);
                        }
                    });
                },
                getDraftData:function(id,successCallback){
                    var self = this;
                    var draftDataList= JSON.parse(LocalStorageService.get('qualityCheckList'));
                    for(var i=0;i<draftDataList.length;i++){
                        if(draftDataList[i].id == id){
                            self.setId(id);
                            self.setCheckData(draftDataList[i].checkData);
                            self.setCheckDataShow(draftDataList[i].checkDataShow);
                            self.setContent(draftDataList[i].content);
                            self.setProblems(draftDataList[i].problems);
                            self.setImagList(draftDataList[i].attach);
                            successCallback.call();
                        }
                    }
                },
                getUserName:function(){
                    return userService.getUserName();
                },
                getRootOrgId:function(){
                    return userService.getRootOrgId();
                },
                getUserId:function(){
                    return userService.getUserId();
                },
                /* 质朴长存法  by lifesinger */
                prefixInteger : function (num, n) {
                    var len = num.toString().length;
                    while (len < n) {
                        num = "0" + num;
                        len++;
                    }
                    return num;
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
                getType:function(){
                    return type;
                },
                setType:function(data){
                    type = data;
                },
                getCheckData:function(){
                    return checkData;
                },
                setCheckData:function(data){
                    checkData = data;
                },
                setTitle:function(data){
                    checkData.title = data;
                },
                getId:function(){
                    return id;
                },
                setId:function(data){
                    id=data;
                },
                setCheckDate:function(data){
                    checkData.checkDate = data;
                },
                setCheckPosName:function(data){
                    checkData.checkPosName = data;
                },
                setSolverId:function(data){
                    checkData.solverId = data;
                },
                getPositionList:function(){
                    return position;
                },
                setPositionList:function(data){
                    position = data;
                },
                getSolverList:function(){
                    return solver;
                },
                setSolverList:function(data){
                    solver = data;
                },
                setStatusId:function(data){
                    checkData.statusId = data;
                },
                getCheckDataShow:function(){
                    return checkDataShow;
                },
                setCheckDataShow:function(data){
                    checkDataShow = data;
                },
                setChecker:function(data){
                    checkDataShow.checker = data;
                },
                setCheckPositionName:function(data){
                    checkDataShow.checkPositionName = data;
                },
                setSolverName:function(data){
                    checkDataShow.solverName = data;
                },
                getContent:function(){
                    return content;
                },
                setContent:function(data){
                    content = data;
                },
                pushContent:function(data){
                    content.push(data);
                },
                removeContent:function(id){
                    var self = this;
                    for(var i=0;i<content.length;i++){
                        if(content[i].id == id){
                            content.splice(i,1);
                            self.removeContentProblems(id);
                        }
                    }
                },
                setProblems:function(data){
                    problems = data;
                },
                getProblems:function(){
                    return problems;
                },
                pushProblem:function(data){
                    problems.push(data);
                },
                removeContentProblems:function(contentId){
                    var temp = [];
                    for(var i=0;i<problems.length;i++){
                        if(problems[i].pId != contentId){
                            temp.push(problems[i]);
                        }
                    }
                    problems = temp;
                },
                getImagList:function(){
                    return image_list;
                },
                pushImagList:function(data){
                    image_list.push(data);
                },
                setImagList:function(data){
                    image_list = data;
                },
                changeAttach : function(list){
                    if(list.length > 0 ){
                        for(var i=0;i<list.length;i++){
                            var ticket = userService.getTicket();
                            var url = list[i].url.replace("\\", "/");
                            list[i].src = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + url;
                            var item = {src: list[i].src,data:{name: list[i].name, url: list[i].url}};
                            image_list.push(item);
                        }
                    }
                }
            };
        }]);
