angular.module('app.safety.dailyCheck')
    .controller('multipleCheckContentItemController', ['$scope', '$state', '$stateParams','$ionicPopup', 'multipleCheckItemAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,multipleCheckItemAddService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                if ($stateParams.index != null) {
                    $scope.index = $stateParams.index;
                }
                if ($stateParams.id != null) {
                    $scope.pId = $stateParams.id;
                }
                multipleCheckItemAddService.queryCheckContent($scope.pId,2,function(data){
                    $scope.items = data || [];
                    $scope.checkItem($scope.items);
                });
            });
            $scope.checkItem = function(items){
                var problems = multipleCheckItemAddService.getGroupProblems($scope.index) || [];
                if(problems.length >0){
                    for(var j=0;j<items.length;j++){
                        var flag = false;
                        for(var i=0;i<problems.length;i++){
                            if(items[j].id == problems[i].pId){
                                flag = true;
                            }
                        }
                        items[j].checked = flag;
                        if(!flag){
                            multipleCheckItemAddService.removeItem($scope.index,items[j].pid,items[j].id);
                        }
                    }
                }else{
                    for(var k=0;k<items.length;k++){
                        items[k].checked = false;
                    }
                }
            };
            $scope.goProblem = function (pId,id,itemBackUrl,item) {
                var content = multipleCheckItemAddService.getGroupDataList()[$scope.index].content || [];
                for(var j=0;j<content.length;j++){
                    if($scope.pId == content[j].id){
                        item.checked = true;
                        if(content[j].items){
                            var itemss =content[j].items || [];
                            var flag = false;
                            for(var i=0;i<itemss.length;i++){
                                if(itemss[i].id == id){
                                    flag = true;
                                }
                            }
                            if(!flag){
                                content[j].items.push(item);
                            }
                        }else{
                            var items = [];
                            items.push(item);
                            content[j].items = items;
                        }
                        multipleCheckItemAddService.setContent($scope.index,content);
                        $state.go('safety/multipleCheck/multipleCheck-content-item-problem',{index:$scope.index,pId:pId,id:id,backUrl:itemBackUrl});
                        $ionicViewSwitcher.nextDirection("forward");
                    }
                }
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };

        }]);