angular.module('app.safety.dailyCheck')
    .controller('multipleCheckContentItemProblemController', ['$scope', '$state', '$stateParams','$ionicPopup', 'multipleCheckItemAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,multipleCheckItemAddService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl || '';
                }
                if ($stateParams.index != null) {
                    $scope.index = $stateParams.index;
                }
                if ($stateParams.id != null) {
                    $scope.pId = $stateParams.id;
                }
                if ($stateParams.pId != null) {
                    $scope.contentId = $stateParams.pId;
                }
                multipleCheckItemAddService.queryCheckContent($stateParams.id,3,function(data){
                    $scope.problems = data || [];
                    $scope.checkProblem($scope.problems);
                });
                var type = multipleCheckItemAddService.getType();
                if(type == 'add'){
                    $scope.url = 'safety/multipleCheck/multipleCheck-item-add';
                }else if(type =='edit'){
                    $scope.url = 'safety/multipleCheck/multipleCheck-item-edit';
                }else if(type =='storage'){
                    $scope.url = 'safety/multipleCheck/multipleCheck-storage-edit';
                }
            });
            $scope.checkProblem = function(problemss){
                var problems = multipleCheckItemAddService.getGroupProblems($scope.index) || [];
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
                var content = multipleCheckItemAddService.getGroupDataList()[$scope.index].content || [];
                for(var j=0;j<content.length;j++){
                    if($scope.contentId == content[j].id){
                        var items = content[j].items || [];
                        for(var k=0;k<items.length;k++){
                            if($scope.pId == items[k].id){
                                multipleCheckItemAddService.removeItemProblems($scope.index,items[k].id);
                                var problems = [];
                                for(var i=0;i<list.length;i++){
                                    if(list[i].checked != undefined && list[i].checked != '' && list[i].checked){
                                        problems.push(list[i]);
                                        list[i].contentId = $scope.contentId;
                                        multipleCheckItemAddService.pushProblem($scope.index,list[i]);
                                    }
                                }
                                items[k].problems = problems;
                                multipleCheckItemAddService.setContent($scope.index,content);
                                $scope.back();
                            }
                        }
                    }
                }
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{index:$scope.index,id:$stateParams.pId,backUrl:$scope.url});
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.showPrompt = function() {
                $ionicPopup.prompt({
                    title: '新增问题',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    var problems = $scope.problems || [];
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
                            orgId:multipleCheckItemAddService.getRootOrgId(),
                            delFlag:0
                        };
                        multipleCheckItemAddService.insertCheckProblem(problem,function(data){
                            problem.contentId = $scope.contentId;
                            problem.id = data;
                            multipleCheckItemAddService.queryCheckContent(problem.pid,3,function(data){
                                var list = multipleCheckItemAddService.deepClone($scope.problems);
                                var ids =[];
                                for(var j=0;j<list.length;j++){
                                    if(list[j].checked != undefined && list[j].checked != '' && list[j].checked){
                                        ids.push(list[j].id);
                                    }
                                }
                                $scope.problems = data || [];
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