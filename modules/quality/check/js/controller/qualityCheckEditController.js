angular.module('app.quality.check')
    .controller('qualityCheckEditController', ['$scope', '$state', '$stateParams','$ionicPopup', 'qualityCheckAddService', '$filter','$ionicHistory',
        '$ionicActionSheet','LocalStorageService','$ionicViewSwitcher','YTService',
        function ($scope, $state, $stateParams, $ionicPopup,qualityCheckAddService,$filter,$ionicHistory,
                  $ionicActionSheet,LocalStorageService,$ionicViewSwitcher,YTService) {
            $scope.checkData = qualityCheckAddService.getCheckData();
            $scope.checkDataShow = qualityCheckAddService.getCheckDataShow();
            $scope.contentList = qualityCheckAddService.getContent();
            $scope.checkDate = YTM.initDatePicker({
                callback: function () {
                    $scope.checkData.checkDate = $filter('date')($scope.checkDate.date, 'yyyy-MM-dd');
                    qualityCheckAddService.setCheckDate($scope.checkData.checkDate);
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
            qualityCheckAddService.setType($stateParams.type);
            $scope.url = 'quality/check/quality-edit';
            $scope.titleName = '编辑质量通病检查';

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                if($stateParams.id){
                    qualityCheckAddService.queryDetail($stateParams.id,function(){
                        $scope.checkData = qualityCheckAddService.getCheckData();
                        $scope.checkDataShow = qualityCheckAddService.getCheckDataShow();
                    });
                    qualityCheckAddService.queryDetailContent($stateParams.id,function(){
                        $scope.contentList = qualityCheckAddService.getContent();
                    });
                    qualityCheckAddService.queryAttach($stateParams.id,function() {
                        $scope.image_list = qualityCheckAddService.getImagList();
                    });
                }else{
                    $scope.image_list = qualityCheckAddService.getImagList();
                    $scope.checkData = qualityCheckAddService.getCheckData();
                    $scope.checkDataShow = qualityCheckAddService.getCheckDataShow();
                    $scope.contentList = qualityCheckAddService.getContent();
                }

            });

            $scope.showConfirmDel = function(id) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '提示',
                    template: '<p class="text-center">确认删除？</p>',
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        qualityCheckAddService.removeContent(id);
                        $scope.contentList = qualityCheckAddService.getContent();
                        $ionicPopup.alert({
                            title: '提示',
                            template: '<p class="text-center">删除成功!</p>'
                        });
                    }
                });
            };
            $scope.back = function () {
                // 重置数据
                qualityCheckAddService.clearCachedData();
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
                                if(data.data.hasProblem == 1){
                                    qualityCheckAddService.updateQualityCheckData(data.data,data.slave,{status:'audit',pushUserId:data.data.solverId,condition: {状态: '处理'}, wId: 160001,userId:qualityCheckAddService.getUserId(),orgId:qualityCheckAddService.getRootOrgId()},function(data){
                                        if(data.status ==200){
                                            $ionicPopup.alert({
                                                title: '验证',
                                                template: '<p class="text-center">提交成功!</p>'
                                            }).then(function(){
                                                qualityCheckAddService.clearCachedData();
                                                $state.go($scope.backUrl);
                                                $ionicViewSwitcher.nextDirection("back");
                                            });
                                        }
                                    });
                                }else if(data.data.hasProblem == 0){
                                    qualityCheckAddService.updateQualityCheckData(data.data,data.slave,{status:'audit',pushUserId:data.data.solverId,condition: {状态: '通过'}, wId: 160001,userId:qualityCheckAddService.getUserId(),orgId:qualityCheckAddService.getRootOrgId()},function(data){
                                        if(data.status ==200){
                                            $ionicPopup.alert({
                                                title: '验证',
                                                template: '<p class="text-center">提交成功!</p>'
                                            }).then(function(){
                                                qualityCheckAddService.clearCachedData();
                                                $state.go($scope.backUrl);
                                                $ionicViewSwitcher.nextDirection("back");
                                            });
                                        }
                                    });
                                }

                            }
                            if(index == 1){
                                data = $scope.getData(0);
                                qualityCheckAddService.updateDailyCheckData(data.data,data.slave,{status:'saved'},function(data){
                                    if(data.status ==200){
                                        $ionicPopup.alert({
                                            title: '验证',
                                            template: '<p class="text-center">保存成功!</p>'
                                        }).then(function(){
                                            qualityCheckAddService.clearCachedData();
                                            $state.go($scope.backUrl);
                                            $ionicViewSwitcher.nextDirection("back");
                                        });
                                    }
                                });


                            }
                        }
                        return true;
                    }
                });
            };
            $scope.checkSheet = function(){
                var flag = true;
                var checkData = qualityCheckAddService.getCheckData();
                var checkDataShow = qualityCheckAddService.getCheckDataShow();
                var content = qualityCheckAddService.getContent();
                var problem = qualityCheckAddService.getProblems();
                if(checkData.solverId == -1){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">未选择处理人!</p>'
                    });
                }
                if(checkDataShow.hasProblem && problem.length <= 0){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">需要设置检查内容和问题!</p>'
                    });
                }
                if(qualityCheckAddService.getImagList().length <= 0){
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">需要上传检查照片!</p>'
                    });
                }
                var contentFlag = true;
                for(var i=0;i<content.length;i++){
                    if(content[i].problems == undefined || content[i].problems.length <= 0){
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
                var checkData = qualityCheckAddService.getCheckData();
                var checkDataShow = qualityCheckAddService.getCheckDataShow();
                var problem = qualityCheckAddService.getProblems();
                var imagList = qualityCheckAddService.getImagList();
                var data = {
                    id:qualityCheckAddService.getId(),
                    wid:160001,
                    title : "",
                    checkDate:checkData.checkDate,
                    checkerId:qualityCheckAddService.getUserId(),
                    solverId:checkData.solverId,
                    hasProblem:checkDataShow.hasProblem?1:0,
                    checkPosName:checkData.checkPosName,
                    orgId:qualityCheckAddService.getRootOrgId(),
                    statusId:statusId
                };
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
                                t:'quality_qualitycheck_detail',
                                data:{
                                    id:qualityCheckAddService.getId(),
                                    checkContentId:problem[j].pId,
                                    checkProblemId:problem[j].id
                                },
                                key:'id'}
                        );
                    }
                }else if(data.hasProblem == 0){
                    data.title = '质量通病检查';
                }

                if(imagList.length > 0){
                    for(var k=0;k<imagList.length;k++){
                        dataDetail.push(
                            {
                                t:'quality_qualitycheck_attach',
                                data:{
                                    id:qualityCheckAddService.getId(),
                                    name:imagList[k].data.name,
                                    url:imagList[k].data.url
                                },
                                key:'id'}
                        );
                    }
                }

                return {
                    data:data,
                    slave:dataDetail
                }
            };
            $scope.addAttachment = function () {
                YTService.addAttachment($scope, function (item) {
                    $scope.image_list.push(item);
                    qualityCheckAddService.setImagList($scope.image_list);
                });
            };
            $scope.previewOrDelete = function (imgIndex) {
                YTService.previewOrDelete(imgIndex, $scope.image_list,function(){
                    $state.go('quality/check/canvas',{image:$scope.image_list[imgIndex],index:imgIndex,backUrl:$scope.url});
                    $ionicViewSwitcher.nextDirection("forward");
                });
                qualityCheckAddService.setImagList($scope.image_list);
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