angular.module('app.safety.dailyCheck')
    .controller('dailyCheckContentItemProblemController', ['$scope', '$state', '$stateParams','$ionicPopup', 'dailyCheckAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,dailyCheckAddService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                dailyCheckAddService.queryCheckContent($stateParams.id,3,function(data){
                    $scope.problems = data;
                    $scope.checkProblem($scope.problems);
                });
                var type = dailyCheckAddService.getType();
                if(type == 'add'){
                    $scope.url = 'safety/dailyCheck/dailyCheck-add';
                }else if(type =='edit'){
                    $scope.url = 'safety/dailyCheck/dailyCheck-edit';
                }else if(type =='draft'){
                    $scope.url = 'safety/dailyCheck/dailyCheck-drafts-edit';
                }
            });
            $scope.checkProblem = function(problemss){
                var problems = dailyCheckAddService.getProblems();
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
            $scope.chooseItem = function (list) {
                var content = dailyCheckAddService.getContent();
                for(var j=0;j<content.length;j++){
                    if($stateParams.pId == content[j].id){
                        var items = content[j].items;
                        for(var k=0;k<items.length;k++){
                            if($stateParams.id == items[k].id){
                                dailyCheckAddService.removeItemProblems(items[k].id);
                                var problems = [];
                                for(var i=0;i<list.length;i++){
                                    if(list[i].checked != undefined && list[i].checked != '' && list[i].checked){
                                        problems.push(list[i]);
                                        list[i].contentId = $stateParams.pId;
                                        dailyCheckAddService.pushProblem(list[i]);
                                    }
                                }
                                items[k].problems = problems;
                                dailyCheckAddService.setContent(content);
                                $state.go($scope.backUrl,{id:$stateParams.pId,backUrl:$scope.url});
                                $ionicViewSwitcher.nextDirection("back");
                            }
                        }
                    }
                }
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{id:$stateParams.pId,backUrl:$scope.url});
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
                            level:3,
                            orgId:dailyCheckAddService.getRootOrgId(),
                            delFlag:0
                        };
                        dailyCheckAddService.insertCheckProblem(problem,function(data){
                            problem.contentId = $stateParams.pId;
                            problem.id = data;
                            dailyCheckAddService.queryCheckContent(problem.pid,3,function(data){
                                var list = dailyCheckAddService.deepClone($scope.problems);
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