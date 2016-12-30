angular.module('app.safety.multipleCheck')
    .controller('multipleCheckItemEditController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService',
        '$stateParams','$ionicViewSwitcher','$ionicActionSheet',
        '$filter','YTService',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,
                  $stateParams,$ionicViewSwitcher,$ionicActionSheet,
                  $filter,YTService) {

            $scope.openCheckDate = function () {
                $scope.checkDatePopup = $ionicPopup.show({
                    templateUrl: "check-date.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.checkDatePopup.then(function(res) {
                    console.log('Tapped!', res);
                });
            };
            $scope.openStartDate = function () {
                $scope.startDatePopup = $ionicPopup.show({
                    templateUrl: "start-date.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.startDatePopup.then(function(res) {
                    console.log('Tapped!', res);
                });
            };
            $scope.openEndDate = function () {
                $scope.endDatePopup = $ionicPopup.show({
                    templateUrl: "end-date.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.endDatePopup.then(function(res) {
                    console.log('Tapped!', res);
                });
            };

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.id != null){
                    $scope.editId = $stateParams.id;
                    multipleCheckItemAddService.setEditId($scope.editId);
                    multipleCheckItemAddService.queryEditDetailData($scope.editId,function(){
                        $scope.detail = multipleCheckItemAddService.getDetailData();
                        $scope.projectId = $scope.detail.projectId;
                        multipleCheckItemAddService.setProjectId($scope.projectId);
                        $scope.initDate();
                    });
                    multipleCheckItemAddService.queryGroupData($scope.editId,function(){
                        $scope.groupList = multipleCheckItemAddService.getGroupDataList();
                    });
                    multipleCheckItemAddService.queryEditSpotData($scope.editId);
                }else{
                    $scope.editId = multipleCheckItemAddService.getEditId();
                    $scope.projectId = multipleCheckItemAddService.getProjectId();
                    $scope.detail = multipleCheckItemAddService.getDetailData();
                    $scope.groupList = multipleCheckItemAddService.getGroupDataList();
                    $scope.initDate();
                }

                multipleCheckItemAddService.setType('edit');
                multipleCheckItemAddService.queryStructureType();
                $scope.url = 'safety/multipleCheck/multipleCheck-item-edit';
            });

            $scope.initDate = function(){
                $scope.checkDate = YTM.initDatePicker({
                    date: new Date($scope.detail.checkDate),
                    callback: function () {
                        $scope.detail.checkDate = $filter('date')($scope.checkDate.date, 'yyyy-MM-dd');
                        multipleCheckItemAddService.setCheckDate($scope.detail.checkDate);
                        $scope.checkDatePopup.close();
                    }
                });
                $scope.startDate = YTM.initDatePicker({
                    date: new Date($scope.detail.actualBeginDate),
                    callback: function () {
                        $scope.detail.actualBeginDate = $filter('date')($scope.startDate.date, 'yyyy-MM-dd');
                        multipleCheckItemAddService.setStartDate($scope.detail.actualBeginDate);
                        $scope.startDatePopup.close();
                    }
                });
                $scope.endDate = YTM.initDatePicker({
                    date: new Date($scope.detail.plannedEndDate),
                    callback: function () {
                        $scope.detail.plannedEndDate = $filter('date')($scope.endDate.date, 'yyyy-MM-dd');
                        multipleCheckItemAddService.setEndDate($scope.detail.plannedEndDate);
                        $scope.endDatePopup.close();
                    }
                });
            };

            $scope.editPersonInfo = function(){
                $state.go('safety/multipleCheck/multipleCheck-person-info-edit',{backUrl:$scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.editProjectInfo = function(){
                $state.go('safety/multipleCheck/multipleCheck-project-info-edit',{backUrl:$scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.editProjectStatus = function(){
                $state.go('safety/multipleCheck/multipleCheck-project-status',{backUrl:$scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.editAdviceText = function(){
                $state.go('safety/multipleCheck/multipleCheck-advice-text',{backUrl:$scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.toCheckerList = function(){
                $state.go('safety/multipleCheck/multipleCheck-checker-list',{backUrl:$scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.toRandomInfo= function(){
                $state.go('safety/multipleCheck/multipleCheck-item-add-random-info',{backUrl:$scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.openPosition= function(){
                $state.go('safety/multipleCheck/multipleCheck-check-position',{backUrl:$scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.toChoose = function(index,url){
                $state.go(url, {index:index,backUrl: $scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };
            $scope.toChooseById = function(index,id,url){
                $state.go(url, {index:index,id:id,backUrl: $scope.url});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.delGroup = function(index){
                $ionicPopup.confirm({
                    title: '提示',
                    template: '<p class="text-center">确认删除？</p>',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    if(res) {
                        multipleCheckItemAddService.delGroupData(index);
                        $ionicPopup.alert({
                            title: '提示',
                            template: '<p class="text-center">删除成功!</p>'
                        });
                    }
                });
            };

            $scope.delContent = function(groupIndex,index){
                $ionicPopup.confirm({
                    title: '提示',
                    template: '<p class="text-center">确认删除？</p>',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    if(res) {
                        multipleCheckItemAddService.delContent(groupIndex,index);
                        $ionicPopup.alert({
                            title: '提示',
                            template: '<p class="text-center">删除成功!</p>'
                        });
                    }
                });
            };

            $scope.image_list =[];
            $scope.addAttachment = function (index) {
                YTService.addAttachment($scope, function (item) {
                    $scope.groupList[index].attachList.push(item);
                    multipleCheckItemAddService.setImagList(index,$scope.groupList[index].attachList);
                });
            };
            $scope.previewOrDelete = function (index,imgIndex) {
                YTService.previewOrDelete(imgIndex, $scope.groupList[index].attachList,function(){
                    $state.go('safety/multipleCheck/canvas',{editId:$scope.editId,image:$scope.groupList[index].attachList[imgIndex],groupIndex:index,index:imgIndex,backUrl:$scope.url});
                    $ionicViewSwitcher.nextDirection("forward");
                });
                multipleCheckItemAddService.setImagList(index,$scope.groupList[index].attachList);
            };

            $scope.submit  = function(){
                if($scope.validate()){
                    $ionicActionSheet.show({
                        buttons: [
                            { text: '提交' },
                            { text: '保存' }
                        ],
                        cancelText: '取消',
                        cancel: function() {
                            return true;
                        },
                        buttonClicked: function(index) {
                            var data ={};
                            if(index == 0){
                                data = $scope.getData(1);
                                $scope.getPostData(data,'提交成功!');
                            }
                            if(index == 1){
                                data = $scope.getData(0);
                                $scope.getPostData(data,'保存成功!');

                            }
                            return true;
                        }
                    });
                }
            };

            $scope.getPostData = function(data,msg){
                if(data.position.length > 0){
                    multipleCheckItemAddService.insertAddPosition(data.position,function(){
                        $scope.getPosition(data,function(){
                            $scope.postData(data,msg);
                        });
                    });

                }else{
                    $scope.getPosition(data,function(){
                        $scope.postData(data,msg);
                    });
                }
            };

            $scope.getPosition = function(data,callBack){
                data.group = [];
                multipleCheckItemAddService.queryCheckPosition(function(pList){
                    var positionList = pList;
                    for(var i=0;i<positionList.length;i++){
                        var group0 = $scope.getNewGroupData(positionList[i].id,positionList[i].name);
                        if(group0.length > 0){
                            for(var m=0;m<group0.length;m++){
                                data.group.push(group0[m]);
                            }
                        }
                    }
                    callBack();
                });
            };

            $scope.postData = function(data,msg){
                var postData = $scope.changData(data);
                multipleCheckItemAddService.updateCheckData(postData,function(data){
                    if(data.status ==200){
                        $ionicPopup.alert({
                            title: '验证',
                            template: '<p class="text-center">'+msg+'!</p>'
                        }).then(function(){
                            $scope.back();
                        });
                    }else{

                    }
                });
            };

            $scope.changData = function(data){
                var group = data.group || [];
                var params = {
                    id:data.detail.id,
                    orgId:data.detail.orgId,
                    posData:[],
                    prjBase:data.history || {}
                };

                for(var i=0;i<group.length;i++){
                    params.posData.push({
                        t: "safety_multiplecheck_checkgroup",
                        data: {
                            id: data.detail.id,
                            checkPosId: group[i].data.checkPosId
                        },
                        ai: true,
                        slave: group[i].slave,
                        problems:[]
                    });
                }
                if(!data.historyFlag){
                    params.prjBase = null;
                }
                return {
                    mainData:data.mainData,
                    slave:data.slave,
                    params:params
                }
            };

            $scope.validate = function () {
                var flag = true;
                var detail = multipleCheckItemAddService.getDetailData() || {};
                var spot = multipleCheckItemAddService.getSpot() || [];
                var groupList = multipleCheckItemAddService.getGroupDataList() || [];
                if(!multipleCheckItemAddService.validateDate(detail.actualBeginDate,detail.plannedEndDate)){
                    flag = false;
                }else{
                    if(spot.length <= 0){
                        flag = false;
                        $ionicPopup.alert({title: '提示', template: '请设置抽查情况!'});
                    }else{
                        if(groupList.length > 0){
                            var contentFlag = true;
                            var itemsFlag = true;
                            var attachFlag = true;
                            outerLoop:
                                for(var i=0;i<groupList.length;i++){
                                    var content = groupList[i].content || [];
                                    if(content.length <= 0){
                                        contentFlag = false;
                                        flag = false;
                                        break;
                                    }else{
                                        for(var j=0;j<content.length;j++){
                                            var items = content[j].items || [];
                                            if(items <= 0){
                                                itemsFlag = false;
                                                flag = false;
                                                break outerLoop;
                                            }
                                        }
                                    }
                                    var attachList = groupList[i].attachList ||[];
                                    if(attachList.length <= 0){
                                        flag = false;
                                        attachFlag = false;
                                        break;
                                    }
                                }
                            if(!contentFlag){
                                $ionicPopup.alert({title: '提示', template: '存在检查问题未添加检查内容!'});
                            }
                            if(!itemsFlag){
                                $ionicPopup.alert({title: '提示', template: '存在检查内容未添加检查项目!'});
                            }
                            if(!attachFlag){
                                $ionicPopup.alert({title: '提示', template: '存在检查问题未上传照片!'});
                            }
                        }else{
                            flag = false;
                            $ionicPopup.alert({title: '提示', template: '请添加相关问题!'});
                        }
                    }
                }
                return flag;
            };

            $scope.getData = function(statusId){
                var
                    detail = multipleCheckItemAddService.getDetailData() || {},
                    spotList = multipleCheckItemAddService.getSpot() || [],
                    positionList = multipleCheckItemAddService.getPosition() || [],
                    tempDetail = multipleCheckItemAddService.getTempDetail() || {};
                var mainData = {
                    id:detail.id,
                    checkerId:detail.checkerId,
                    checkDate:detail.checkDate,
                    advice:detail.advice,
                    projectStatus:detail.projectStatus,
                    statusId:statusId,
                    extraCheckerName:detail.extraCheckerName
                };
                var checkPosition = [];
                if(positionList.length >0 ){
                    for(var i=0;i<positionList.length;i++){
                        if(positionList[i].addFlag){
                            checkPosition.push({
                                t:'safety_d_checkposition',
                                data: {name:positionList[i].name,orgId:multipleCheckItemAddService.getRootOrgId()},
                                ai: true
                            });
                        }
                    }
                }
                var history = {};
                var historyFlag = false;
                if($scope.checkDetail(detail,tempDetail)){
                    historyFlag = true;
                    history={
                        projectName:detail.projectName,
                        manager:detail.manager,
                        managerTel:detail.managerTel,
                        technician:detail.technician,
                        technicianTel:detail.technicianTel,
                        inspector:detail.inspector,
                        inspectorTel:detail.inspectorTel,
                        safetyOfficer:detail.safetyOfficer,
                        safetyOfficerTel:detail.safetyOfficerTel,
                        cost:detail.cost,
                        groundLayer:detail.groundLayer,
                        underGroundLayer:detail.underGroundLayer,
                        areaOfStructure:detail.areaOfStructure,
                        structureTypeId:detail.structureTypeId,
                        personNumber:detail.personNumber,
                        actualBeginDate:detail.actualBeginDate,
                        plannedEndDate:detail.plannedEndDate,
                        orgId:detail.projectId,
                        companyId:detail.orgId
                    }
                }
                var slave = [];
                if(spotList.length > 0){
                    for(var j=0;j<spotList.length;j++){
                        slave.push({
                            t:'safety_multiplecheck_spot',
                            data:{
                                id:detail.id,
                                spotContentId:spotList[j].id==-1?0:spotList[j].id,
                                spotCheckId:spotList[j].spotCheckId==-1?0:spotList[j].spotCheckId
                            },
                            key:'id'
                        });
                    }
                }
                return {
                    detail:detail,
                    mainData:mainData,
                    position:checkPosition,
                    historyFlag:historyFlag,
                    history:history,
                    slave:slave
                };
            };

            $scope.getNewGroupData = function(positionId,positionName){
                var groupList = multipleCheckItemAddService.getGroupDataList() || [];
                var group = [];
                if(groupList.length > 0){
                    for(var i=0;i<groupList.length;i++){
                        if(groupList[i].checkPosName == positionName){
                            var slave = [];
                            if(groupList[i].attachList.length > 0){
                                for(var j=0;j<groupList[i].attachList.length;j++){
                                    slave.push({
                                        t:'safety_multiplecheck_checkgroup_attach',
                                        data:{
                                            name:groupList[i].attachList[j].data.name,
                                            url:groupList[i].attachList[j].data.url
                                        },
                                        key:'id'
                                    });
                                }
                            }
                            if(groupList[i].problems.length >0){
                                for(var k=0;k<groupList[i].problems.length;k++){
                                    slave.push({
                                        t:'safety_multiplecheck_checkgroup_detail',
                                        data:{
                                            checkContentId:groupList[i].problems[k].contentId,
                                            checkItemId:groupList[i].problems[k].pId,
                                            checkProblemId:groupList[i].problems[k].id
                                        },
                                        key:'id'
                                    });
                                }
                            }
                            group.push(
                                {
                                    t:'safety_multiplecheck_checkgroup',
                                    data:{
                                        checkPosId:positionId
                                    },
                                    key:'id',
                                    slave:slave,
                                    ai:true
                                }
                            );
                            break;
                        }
                    }
                }
                return group;
            };

            $scope.checkDetail = function(detail,tempDetail){
                var historyFlag = false;
                if(detail.projectName != tempDetail.projectName){
                    historyFlag = true;
                }
                if(detail.manager != tempDetail.manager){
                    historyFlag = true;
                }
                if(detail.managerTel != tempDetail.managerTel){
                    historyFlag = true;
                }
                if(detail.technician != tempDetail.technician){
                    historyFlag = true;
                }
                if(detail.technicianTel != tempDetail.technicianTel){
                    historyFlag = true;
                }
                if(detail.inspector != tempDetail.inspector){
                    historyFlag = true;
                }
                if(detail.inspectorTel != tempDetail.inspectorTel){
                    historyFlag = true;
                }
                if(detail.safetyOfficer != tempDetail.safetyOfficer){
                    historyFlag = true;
                }
                if(detail.safetyOfficerTel != tempDetail.safetyOfficerTel){
                    historyFlag = true;
                }
                if(detail.cost != tempDetail.cost){
                    historyFlag = true;
                }
                if(detail.groundLayer != tempDetail.groundLayer){
                    historyFlag = true;
                }
                if(detail.underGroundLayer != tempDetail.underGroundLayer){
                    historyFlag = true;
                }
                if(detail.areaOfStructure != tempDetail.areaOfStructure){
                    historyFlag = true;
                }
                if(detail.structureTypeId != tempDetail.structureTypeId){
                    historyFlag = true;
                }
                if(detail.personNumber != tempDetail.personNumber){
                    historyFlag = true;
                }
                if(detail.actualBeginDate != tempDetail.actualBeginDate){
                    historyFlag = true;
                }
                if(detail.plannedEndDate != tempDetail.plannedEndDate){
                    historyFlag = true;
                }
                if(detail.orgId != tempDetail.orgId){
                    historyFlag = true;
                }
                if(detail.projectId != tempDetail.projectId){
                    historyFlag = true;
                }
                return historyFlag;
            };

            $scope.back = function () {
                multipleCheckItemAddService.clearCachedData();
                $state.go($scope.backUrl,{projectId:$scope.projectId,backUrl:'safety/multipleCheck/multipleCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
