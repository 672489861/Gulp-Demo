angular.module('app.quality.check')
    .factory("qualityCheckService", ['YTService', 'UserService', '$ionicActionSheet','env',
        function (YT, userService,$ionicActionSheet,env) {
            var serviceData = [],
                pageIndex = 0,
                pageSize = 10,
                hasNextPage = true,
                right = {
                    checker:false,
                    solver:false,
                    rechecker:false
                },
                condition = {
                    typeId:-1,
                    checker:"",
                    solver:"",
                    problem:-1,
                    hasProblemName:"",
                    startTime: "",
                    endTime: ""
                },
                image_list=[],
                content=[];
            return {
                loadListData: function (successCallback) {
                    ++pageIndex;
                    var self = this;
                    right.checker = YT.haveRight(16001002);
                    right.solver = YT.haveRight(16001003);
                    right.rechecker = YT.haveRight(16001004);
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
                    //pageInfo.pageCount确定页数
                    if (pageIndex >= pageInfo.pageCount) {
                        hasNextPage = false;
                    } else {
                        hasNextPage = true;
                    }
                },
                //刷新
                refreshListData: function (successCallBack) {
                    pageIndex = 0;
                    hasNextPage = true;
                    serviceData = [];
                    right = {
                        checker:false,
                        solver:false,
                        rechecker:false
                    };
                    this.loadListData(successCallBack);
                },

                clearCachedData: function () {
                    pageIndex = 0;
                    hasNextPage = true;
                    serviceData = [];
                    right = {
                        checker:false,
                        solver:false,
                        rechecker:false
                    };
                    image_list=[];
                    content=[];
                },

                getSearchData: function () {
                    var data = {
                        m: 16001001,
                        t: 'v_quality_qualitycheck_processing',
                        order: 'id desc',
                        page: pageIndex,
                        rows: pageSize
                    };
                    var filter = this.getSearchFilter();
                    data.filter = JSON.stringify(filter);
                    return data;
                },

                getSearchFilter: function () {
                    var self = this;
                    var typeId = userService.getTypeId();
                    var rootId = userService.getRootOrgId();
                    var userId = userService.getUserId();
                    var filter = [];
                    filter.push({field: 'orgId', value: rootId, operator: '=', relation: 'AND'});
                    if(condition.typeId != -1){
                        if(condition.typeId == 0){
                            filter.push({field: 'nodeName', value: '草稿箱', operator: '=', relation: 'AND'});
                        }else if(condition.typeId == 1){
                            filter.push({field: 'nodeName', value: '处理人审核', operator: '=', relation: 'AND'});
                        }else if(condition.typeId == 2){
                            filter.push({field: 'nodeName', value: '复查人审核', operator: '=', relation: 'AND'});
                        }else if(condition.typeId == 3){
                            filter.push({field: 'nodeName', value: '审批通过', operator: '=', relation: 'AND'});
                        }else if(condition.typeId == 4){
                            filter.push({field: 'nodeName', value: '审批不通过', operator: '=', relation: 'AND'});
                        }else if(condition.typeId == 5){
                            filter.push({field: 'checkerId', value:userId, operator: '=', relation: 'AND'});
                        }
                    }
                    if(condition.problem != -1){
                        if(condition.problem == 1){
                            filter.push({field: 'hasProblem', value:1, operator: '=', relation: 'AND'});
                        }else if(condition.problem == 0){
                            filter.push({field: 'hasProblem', value:0, operator: '=', relation: 'AND'});
                        }
                    }
                    if (condition.startTime != '' && condition.endTime != '') {
                        filter.push(
                            {field: 'checkDate', value: condition.startTime, operator: '>=', relation: 'AND'},
                            {field: 'checkDate', value: condition.endTime, operator: '<=', relation: 'AND'});
                    } else if (condition.startTime != '') {
                        filter.push(
                            {field: 'checkDate', value: condition.startTime, operator: '>=', relation: 'AND'});
                    } else if (condition.endTime != '') {
                        filter.push(
                            {field: 'checkDate', value: condition.endTime, operator: '<=', relation: 'AND'});
                    }
                    if(condition.checker != ''){
                        filter.push({field: 'checkerName', value:'%'+condition.checker+'%', operator: 'like', relation: 'AND'});
                    }
                    if(condition.solver != ''){
                        filter.push({field: 'solverName', value:'%'+condition.solver+'%', operator: 'like', relation: 'AND'});
                    }
                    var oneFilter = self.deepClone(filter);
                    var twoFilter = self.deepClone(filter);
                    var threeFilter = self.deepClone(filter);
                    filter=[];
                    if(right.checker || right.solver || right.rechecker){
                        if(right.checker){
                            oneFilter.push({field: 'checkerId', value: userId, operator: '=', relation: 'OR'});
                            filter.push(oneFilter);
                        }
                        if(right.solver){
                            var twoOneFilter = self.deepClone(twoFilter);
                            var twoTwoFilter = self.deepClone(twoFilter);
                            var twoThreeFilter = self.deepClone(twoFilter);
                            twoOneFilter.push({field: 'solverId', value: userId, operator: '=', relation: 'AND'});
                            twoOneFilter.push({field: 'nodeName', value: '处理人审核', operator: '=', relation: 'OR'});
                            twoTwoFilter.push({field: 'solverId', value: userId, operator: '=', relation: 'AND'});
                            twoTwoFilter.push({field: 'nodeName', value: '审批通过', operator: '=', relation: 'OR'});
                            twoThreeFilter.push({field: 'solverId', value: userId, operator: '=', relation: 'AND'});
                            twoThreeFilter.push({field: 'nodeName', value: '审批不通过', operator: '=', relation: 'OR'});
                            filter.push(twoOneFilter);
                            filter.push(twoTwoFilter);
                            filter.push(twoThreeFilter);
                        }
                        if(right.rechecker){
                            var threeOneFilter = self.deepClone(threeFilter);
                            var threeTwoFilter = self.deepClone(threeFilter);
                            var threeThreeFilter = self.deepClone(threeFilter);
                            threeOneFilter.push({field: 'nodeName', value: '复查人审核', operator: '=', relation: 'OR'});
                            threeTwoFilter.push({field: 'operaterId', value: userId, operator: '=', relation: 'AND'});
                            threeTwoFilter.push({field: 'nodeName', value: '审批通过', operator: '=', relation: 'OR'});
                            threeThreeFilter.push({field: 'operaterId', value: userId, operator: '=', relation: 'AND'});
                            threeThreeFilter.push({field: 'nodeName', value: '审批不通过', operator: '=', relation: 'OR'});
                            filter.push(threeOneFilter);
                            filter.push(threeTwoFilter);
                            filter.push(threeThreeFilter);
                        }

                    }else{
                        filter.push({field: 'checkerId', value: -999, operator: '=', relation: ''});
                    }
                    return filter;
                },

                queryDetail:function(id,successCallback){
                    var data = {
                        m: 16001001,
                        t: 'v_quality_qualitycheck'
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

                queryDetailProblem: function (id, successCallback) {
                    var self = this;
                    var data = {
                        m: 16001001,
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
                            successCallback.call();
                        }
                    });
                },

                queryDetailCheckAttach:function(id, successCallback){
                    var self = this;
                    var data = {
                        m: 16001001,
                        t: 'quality_qualitycheck_attach'
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
                queryDetailRecheckAttach:function(id, successCallback){
                    var self = this;
                    var data = {
                        m: 16001001,
                        t: 'quality_qualitycheck_recheck_attach'
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
                solveAndRecheckData:function(obj, m, status,successCallback){
                    var checkData = {
                        wId: obj.wid,
                        dataId: obj.id,
                        opinion: '',
                        checkerOrgId: userService.getRootOrgId()
                    };
                    var attach = {};
                    if(obj.imagList != undefined && obj.imagList.length >0){
                        attach.data = [];
                        for(var c=0;c<obj.imagList.length;c++){
                            var innerData = obj.imagList[c].data;
                            attach.data.push(innerData);
                        }
                    }
                    var pushUserId = -1;
                    if(status == '复查'){
                        pushUserId = obj.checkerId;
                    }else if(status == '通过' || status == '不通过'){
                        pushUserId = obj.solverId;
                    }
                    var params = {
                        condition: {状态: status},
                        wId: obj.wid,
                        orgId: userService.getRootOrgId(),
                        id: obj.id,
                        recheckDate:obj.recheckDate,
                        recheckerId:obj.recheckerId,
                        pushUserId:pushUserId,
                        attach:attach
                    };

                    var data = {
                        m: m,
                        t: 'wf_check',
                        v: JSON.stringify([{
                            t: 'wf_check',
                            data: checkData,
                            ai: true
                        }]),
                        params: JSON.stringify(params)
                    };

                    YT.insert({
                        data: data,
                        successCallback: function (data) {
                            if (data.status == 200) {
                                successCallback.call();
                            }
                        }
                    });
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

                resetCondition: function () {
                    condition = {
                        typeId:-1,
                        checker:"",
                        solver:"",
                        problem:-1,
                        hasProblemName:"",
                        startTime: "",
                        endTime: ""
                    };
                },

                getServiceData: function () {
                    return serviceData;
                },

                hasNextPage: function () {
                    return hasNextPage;
                },
                getContent:function(){
                    return content;
                },
                setContent:function(data){
                    content = data;
                },
                getCondition: function () {
                    return condition;
                },
                setStartTime:function(data){
                    condition.startTime = data;
                },
                setEndTime:function(data){
                    condition.endTime = data;
                },
                getRight:function(){
                    return right;
                },
                getUserName:function(){
                    return userService.getUserName();
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
                changeAttach : function(list){
                    if(list.length > 0 ){
                        for(var i=0;i<list.length;i++){
                            var ticket = userService.getTicket();
                            list[i].src = list[i].url.replace("\\", "/");
                            list[i].src = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + list[i].src;
                        }
                    }
                },
                preview : function (imgIndex, arr) {
                    $ionicActionSheet.show({
                        buttons: [
                            {text: '预览'}
                        ],
                        cancelText: '关闭',
                        cancel: function () {
                            return true;
                        },
                        buttonClicked: function () {
                            PhotoViewer.show(arr[imgIndex].src);
                            return true;
                        }
                    });
                },
                getImagList:function(){
                    return image_list;
                },
                pushImagList:function(data){
                    image_list.push(data);
                },
                setImagList:function(data){
                    image_list = data;
                }

            };
        }]);
