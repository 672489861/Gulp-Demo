angular.module('app.safety.dailyCheck')
    .controller('dailyCheckEditController', ['$scope', '$state', '$stateParams','$ionicPopup', 'dailyCheckAddService', '$filter','$ionicHistory',
        '$ionicActionSheet','LocalStorageService','$ionicViewSwitcher','YTService',
        function ($scope, $state, $stateParams, $ionicPopup,dailyCheckAddService,$filter,$ionicHistory,
                  $ionicActionSheet,LocalStorageService,$ionicViewSwitcher,YTService) {
            $scope.checkData = dailyCheckAddService.getCheckData();
            $scope.checkDataShow = dailyCheckAddService.getCheckDataShow();
            $scope.contentList = dailyCheckAddService.getContent();
            $scope.checkTypeFlag = false;
            $scope.checkDate = YTM.initDatePicker({
                callback: function () {
                    $scope.checkData.checkDate = $filter('date')($scope.checkDate.date, 'yyyy-MM-dd');
                    dailyCheckAddService.setCheckDate($scope.checkData.checkDate);
                    $scope.checkDatePopup.close();
                }
            });
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
            dailyCheckAddService.setType($stateParams.type);
            $scope.url = 'safety/dailyCheck/dailyCheck-edit';
            $scope.titleName = '编辑安全检查';

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.id){
                    dailyCheckAddService.queryDetail($stateParams.id,function(){
                        $scope.checkData = dailyCheckAddService.getCheckData();
                        $scope.checkDataShow = dailyCheckAddService.getCheckDataShow();
                    });
                    dailyCheckAddService.queryDetailContent($stateParams.id,function(){
                        $scope.contentList = dailyCheckAddService.getContent();
                        if($stateParams.contentList){
                            $scope.contentList = $stateParams.contentList;
                        }
                        $scope.checkContent($scope.contentList);
                    });
                    dailyCheckAddService.queryAttach($stateParams.id,function() {
                        $scope.image_list = dailyCheckAddService.getImagList();
                    });
                }else{
                    $scope.image_list = dailyCheckAddService.getImagList();
                    $scope.checkData = dailyCheckAddService.getCheckData();
                    $scope.checkDataShow = dailyCheckAddService.getCheckDataShow();
                    $scope.contentList = dailyCheckAddService.getContent();
                    $scope.checkContent($scope.contentList);
                }

                dailyCheckAddService.queryCheckType(function(data){
                    $scope.checkType = data;
                });
            });
            $scope.checkContent = function(contents){
                for(var j=0;j<contents.length;j++){
                    var items = contents[j].items;
                    var returnItems = [];
                    if(items != undefined){
                        for(var i=0;i<items.length;i++){
                            var problems = items[i].problems;
                            if(problems != undefined && problems.length >0){
                                returnItems.push(items[i]);
                            }
                        }
                    }
                    contents[j].items = returnItems;
                }
            };

            $scope.close = function(){
                $scope.checkTypeFlag = false;
            };

            $scope.openCheckType = function () {
                $scope.checkTypeFlag = true;
            };
            $scope.closeCheckType = function (id,name) {
                $scope.checkData.checkTypeId = id;
                dailyCheckAddService.setCheckTypeId($scope.checkData.checkTypeId);
                $scope.checkDataShow.checkTypeName = name;
                dailyCheckAddService.setCheckTypeName($scope.checkDataShow.checkTypeName);
                $scope.checkTypeFlag = false;
            };

            $scope.showConfirmDel = function(id) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '提示',
                    template: '<p class="text-center">确认删除？</p>',
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        dailyCheckAddService.removeContent(id);
                        $scope.contentList = dailyCheckAddService.getContent();
                        $ionicPopup.alert({
                            title: '提示',
                            template: '<p class="text-center">删除成功!</p>'
                        });
                    }
                });
            };
            $scope.back = function () {
                // 重置数据
                dailyCheckAddService.clearCachedData();
                $state.go($scope.backUrl);
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.submit = function () {
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
                        if($scope.checkSheet()){
                            var data ={};
                            if(index == 0){
                                data = $scope.getData(1);
                                if(data.addPosFlag){
                                    dailyCheckAddService.insertAddPosition(data.addPosition,function(positionId){
                                        data.data.checkPosId = positionId;
                                        if(data.data.hasProblem == 1){
                                            dailyCheckAddService.updateDailyCheckData(data.data,data.slave,{status:'audit',pushUserId:data.data.solverId,condition: {状态: '处理'}, wId: 150001,userId:dailyCheckAddService.getUserId(),orgId:dailyCheckAddService.getRootOrgId()},function(data){
                                                if(data.status ==200){
                                                    $ionicPopup.alert({
                                                        title: '验证',
                                                        template: '<p class="text-center">提交成功!</p>'
                                                    }).then(function(){
                                                        dailyCheckAddService.clearCachedData();
                                                        $state.go($scope.backUrl);
                                                        $ionicViewSwitcher.nextDirection("back");
                                                    });
                                                }
                                            });
                                        }else if(data.data.hasProblem == 0){
                                            dailyCheckAddService.updateDailyCheckData(data.data,data.slave,{status:'audit',pushUserId:data.data.solverId,condition: {状态: '通过'}, wId: 150001,userId:dailyCheckAddService.getUserId(),orgId:dailyCheckAddService.getRootOrgId()},function(data){
                                                if(data.status ==200){
                                                    $ionicPopup.alert({
                                                        title: '验证',
                                                        template: '<p class="text-center">提交成功!</p>'
                                                    }).then(function(){
                                                        dailyCheckAddService.clearCachedData();
                                                        $state.go($scope.backUrl);
                                                        $ionicViewSwitcher.nextDirection("back");
                                                    });
                                                }
                                            });
                                        }

                                    })
                                }else{
                                    if(data.data.hasProblem == 1){
                                        dailyCheckAddService.updateDailyCheckData(data.data,data.slave,{status:'audit',pushUserId:data.data.solverId,condition: {状态: '处理'}, wId: 150001,userId:dailyCheckAddService.getUserId(),orgId:dailyCheckAddService.getRootOrgId()},function(data){
                                            if(data.status ==200){
                                                $ionicPopup.alert({
                                                    title: '验证',
                                                    template: '<p class="text-center">提交成功!</p>'
                                                }).then(function(){
                                                    dailyCheckAddService.clearCachedData();
                                                    $state.go($scope.backUrl);
                                                    $ionicViewSwitcher.nextDirection("back");
                                                });
                                            }
                                        });
                                    }else if(data.data.hasProblem == 0){
                                        dailyCheckAddService.updateDailyCheckData(data.data,data.slave,{status:'audit',pushUserId:data.data.solverId,condition: {状态: '通过'}, wId: 150001,userId:dailyCheckAddService.getUserId(),orgId:dailyCheckAddService.getRootOrgId()},function(data){
                                            if(data.status ==200){
                                                $ionicPopup.alert({
                                                    title: '验证',
                                                    template: '<p class="text-center">提交成功!</p>'
                                                }).then(function(){
                                                    dailyCheckAddService.clearCachedData();
                                                    $state.go($scope.backUrl);
                                                    $ionicViewSwitcher.nextDirection("back");
                                                });
                                            }
                                        });
                                    }

                                }

                            }
                            if(index == 1){
                                data = $scope.getData(0);
                                if(data.addPosFlag){
                                    dailyCheckAddService.insertAddPosition(data.addPosition,function(positionId){
                                        data.data.checkPosId = positionId;
                                        dailyCheckAddService.updateDailyCheckData(data.data,data.slave,{status:'saved'},function(data){
                                            if(data.status ==200){
                                                $ionicPopup.alert({
                                                    title: '验证',
                                                    template: '<p class="text-center">保存成功!</p>'
                                                }).then(function(){
                                                    dailyCheckAddService.clearCachedData();
                                                    $state.go($scope.backUrl);
                                                    $ionicViewSwitcher.nextDirection("back");
                                                });
                                            }
                                        });
                                    })
                                }else{
                                    dailyCheckAddService.updateDailyCheckData(data.data,data.slave,{status:'saved'},function(data){
                                        if(data.status ==200){
                                            $ionicPopup.alert({
                                                title: '验证',
                                                template: '<p class="text-center">保存成功!</p>'
                                            }).then(function(){
                                                dailyCheckAddService.clearCachedData();
                                                $state.go($scope.backUrl);
                                                $ionicViewSwitcher.nextDirection("back");
                                            });
                                        }
                                    });
                                }

                            }
                        }
                        return true;
                    }
                });
            };
            $scope.checkSheet = function(){
                var flag = true;
                var checkData = dailyCheckAddService.getCheckData();
                var checkDataShow = dailyCheckAddService.getCheckDataShow();
                var content = dailyCheckAddService.getContent();
                var problem = dailyCheckAddService.getProblems();
                if(checkData.solverId == -1){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">未选择处理人!</p>'
                    });
                }
                if(checkData.checkTypeId == -1){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">未选择检查类型!</p>'
                    });
                }
                if(checkData.checkPosId == -1 && checkDataShow.checkPositionName == ''){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">未选择检查位置!</p>'
                    });
                }
                if(checkDataShow.hasProblem && problem.length <= 0){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">需要设置检查内容和问题!</p>'
                    });
                }
                if(dailyCheckAddService.getImagList().length <= 0){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">需要上传检查照片!</p>'
                    });
                }
                var contentFlag = true;
                for(var i=0;i<content.length;i++){
                    if(content[i].items == undefined || content[i].items.length <= 0){
                        contentFlag = false;
                    }
                }
                if(!contentFlag){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">有检查内容未设置问题!</p>'
                    });
                }
                return flag;
            };
            $scope.getData = function(statusId){
                var checkData = dailyCheckAddService.getCheckData();
                var checkDataShow = dailyCheckAddService.getCheckDataShow();
                var problem = dailyCheckAddService.getProblems();
                var imagList = dailyCheckAddService.getImagList();
                var data = {
                    id:dailyCheckAddService.getId(),
                    wid:150001,
                    title : "",
                    checkDate:checkData.checkDate,
                    checkerId:dailyCheckAddService.getUserId(),
                    solverId:checkData.solverId,
                    checkTypeId:checkData.checkTypeId,
                    hasProblem:checkDataShow.hasProblem?1:0,
                    checkPosId:checkData.checkPosId,
                    orgId:dailyCheckAddService.getRootOrgId(),
                    statusId:statusId
                };
                var position={};
                var dataDetail =[];
                var title = "";
                if(data.hasProblem == 1){
                    for(var i=0;i<problem.length-1;i++){
                        title += problem[i].name+"；";
                    }
                    title += problem[problem.length-1].name;
                    data.title = title;
                    for(var j=0;j<problem.length;j++){
                        dataDetail.push(
                            {
                                t:'safety_dailycheck_detail',
                                data:{
                                    id:dailyCheckAddService.getId(),
                                    checkContentId:problem[j].contentId,
                                    checkItemId:problem[j].pId,
                                    checkProblemId:problem[j].id
                                },
                                key:'id'}
                        );
                    }
                }else if(data.hasProblem == 0){
                    data.title = checkDataShow.checkTypeName;
                }
                var flag = false;
                if(checkData.checkPosId == -1 && checkDataShow.checkPositionName != ''){
                    flag = true;
                    position = {
                        name:checkDataShow.checkPositionName,
                        orgId:dailyCheckAddService.getRootOrgId()
                    };
                }
                if(imagList.length > 0){
                    for(var k=0;k<imagList.length;k++){
                        dataDetail.push(
                            {
                                t:'safety_dailycheck_attach',
                                data:{
                                    id:dailyCheckAddService.getId(),
                                    name:imagList[k].data.name,
                                    url:imagList[k].data.url
                                },
                                key:'id'}
                        );
                    }
                }


                return {
                    data:data,
                    slave:dataDetail,
                    addPosFlag:flag,
                    addPosition:position
                }
            };
            $scope.addAttachment = function () {
                YTService.addAttachment($scope, function (item) {
                    $scope.image_list.push(item);
                    dailyCheckAddService.setImagList($scope.image_list);
                });
            };
            $scope.previewOrDelete = function (imgIndex) {
                YTService.previewOrDelete(imgIndex, $scope.image_list,function(){
                    $state.go('safety/dailyCheck/canvas',{image:$scope.image_list[imgIndex],index:imgIndex,backUrl:$scope.url});
                    $ionicViewSwitcher.nextDirection("forward");
                });
                dailyCheckAddService.setImagList($scope.image_list);
            };

            $scope.toChoose = function(url,backUrl){
                $state.go(url, {backUrl: backUrl});
                $ionicViewSwitcher.nextDirection("forward");
            };
            $scope.toChooseById = function(id,url,backUrl){
                $state.go(url, {id:id,backUrl: backUrl});
                $ionicViewSwitcher.nextDirection("forward");
            }
        }]);