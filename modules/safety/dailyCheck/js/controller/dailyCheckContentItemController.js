angular.module('app.safety.dailyCheck')
    .controller('dailyCheckContentItemController', ['$scope', '$state', '$stateParams','$ionicPopup', 'dailyCheckAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,dailyCheckAddService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                dailyCheckAddService.queryCheckContent($stateParams.id,2,function(data){
                    $scope.pId = $stateParams.id;
                    $scope.items = data;
                    $scope.checkItem($scope.items);
                });
            });
            $scope.checkItem = function(items){
                var problems = dailyCheckAddService.getProblems();
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
                            dailyCheckAddService.removeItem(items[j].pid,items[j].id);
                        }
                    }
                }else{
                    if(items != undefined){
                        for(var k=0;k<items.length;k++){
                            items[k].checked = false;
                        }
                    }
                }
            };
            $scope.goProblem = function (pId,id,itemBackUrl,item) {
                var content = dailyCheckAddService.getContent();
                for(var j=0;j<content.length;j++){
                    if($stateParams.id == content[j].id){
                        item.checked = true;
                        if(content[j].items !=undefined && content[j].items != ''){
                            var itemss =content[j].items;
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
                        dailyCheckAddService.setContent(content);
                        $state.go('safety/dailyCheck/dailyCheck-content-item-problem',{pId:pId,id:id,backUrl:itemBackUrl});
                        $ionicViewSwitcher.nextDirection("forward");
                    }
                }
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };

        }]);