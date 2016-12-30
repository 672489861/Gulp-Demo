angular.module('app.quality.check')
    .controller('qualityCheckContentProblemController', ['$scope', '$state', '$stateParams','$ionicPopup', 'qualityCheckAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,qualityCheckAddService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                qualityCheckAddService.queryCheckContent($stateParams.id,2,function(data){
                    $scope.problems = data;
                    $scope.checkProblem($scope.problems);
                });
                var type = qualityCheckAddService.getType();
                if(type == 'add'){
                    $scope.url = 'quality/check/quality-add';
                }else if(type =='edit'){
                    $scope.url = 'quality/check/quality-edit';
                }else if(type =='draft'){
                    $scope.url = 'quality/check/quality-drafts-edit';
                }
            });
            $scope.checkProblem = function(problemss){
                var problems = qualityCheckAddService.getProblems();
                if(problems.length >0){
                    for(var j=0;j<problemss.length;j++){
                        var flag = false;
                        for(var i=0;i<problems.length;i++){
                            if(problemss[j].id == problems[i].id){
                                flag = true;
                            }
                        }
                        problemss[j].checked =flag;
                    }
                }else{
                    for(var k=0;k<problemss.length;k++){
                        problemss[k].checked =false;
                    }
                }
            };
            $scope.chooseProblem = function (list) {
                var content = qualityCheckAddService.getContent();
                for(var j=0;j<content.length;j++){
                    if($stateParams.id == content[j].id){
                        qualityCheckAddService.removeContentProblems(content[j].id);
                        var problems = [];
                        for(var i=0;i<list.length;i++){
                            if(list[i].checked != undefined && list[i].checked != '' && list[i].checked){
                                problems.push(list[i]);
                                qualityCheckAddService.pushProblem(list[i]);
                            }
                        }
                        content[j].problems = problems;
                        qualityCheckAddService.setContent(content);
                        $state.go($scope.backUrl,{backUrl:'quality/check/quality-list'});
                        $ionicViewSwitcher.nextDirection("back");
                    }
                }
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'quality/check/quality-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.showPrompt = function() {
                $ionicPopup.prompt({
                    title: '新增问题',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    var problems = $scope.problems;
                    var flag = false;
                    var index = -1;
                    for(var i=0;i<problems.length;i++){
                        if(problems[i].name == res.trim()){
                            flag = true;
                            index = i;
                        }
                    }
                    if(!flag){
                        var problem ={
                            name : res.trim(),
                            pid:$stateParams.id,
                            level:2,
                            orgId:qualityCheckAddService.getRootOrgId(),
                            delFlag:0
                        };
                        qualityCheckAddService.insertCheckProblem(problem,function(data){
                            problem.contentId = $stateParams.pId;
                            problem.id = data;
                            qualityCheckAddService.queryCheckContent(problem.pid,2,function(data){
                                var list = qualityCheckAddService.deepClone($scope.problems);
                                var ids =[];
                                for(var j=0;j<list.length;j++){
                                    if(list[j].checked != undefined && list[j].checked != '' && list[j].checked){
                                        ids.push(list[j].id);
                                    }
                                }
                                $scope.problems = data;
                                for(var i=0;i<$scope.problems.length;i++){
                                    if($scope.problems[i].id == problem.id){
                                        $scope.problems[i].checked = true;
                                        continue;
                                    }
                                    for(var m=0;m<ids.length;m++){
                                        if($scope.problems[i].id == ids[m]){
                                            $scope.problems[i].checked = true;
                                            break;
                                        }
                                    }
                                }
                            });
                        });
                    }else{
                        if(index != -1){
                            $scope.problems[index].checked = true;
                        }
                    }
                });
            };

        }]);