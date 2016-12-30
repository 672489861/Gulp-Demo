angular.module('app.safety.dailyCheck')
    .controller('multipleCheckContentController', ['$scope', '$state', '$stateParams','$ionicPopup', 'multipleCheckItemAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,multipleCheckItemAddService,$ionicViewSwitcher) {

            $scope.content =[];
            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                if ($stateParams.index != null) {
                    $scope.index = $stateParams.index;
                }
                multipleCheckItemAddService.queryCheckContent(-1,1,function(data){
                    $scope.content = data || [];
                    $scope.checkContent();
                });

            });
            $scope.checkContent = function(){
                var contentList = multipleCheckItemAddService.getGroupDataList()[$scope.index].content;
                contentList = contentList || [];
                if($scope.content.length >0){
                    for(var j=0;j<$scope.content.length;j++){
                        var flag = false;
                        if(contentList.length >0){
                            for(var i=0;i<contentList.length;i++){
                                if($scope.content[j].id == contentList[i].id){
                                    flag = true;
                                }
                            }
                        }
                        $scope.content[j].checked=flag;
                    }
                }

            };
            $scope.chooseContent = function (list) {

                var contentList = multipleCheckItemAddService.getGroupDataList()[$scope.index].content || [];
                var returnContent = multipleCheckItemAddService.deepClone(contentList);
                for(var i=0;i<list.length;i++){
                    if(list[i].checked != undefined && list[i].checked != '' && list[i].checked){
                        var flag = false;
                        for(var j=0;j<contentList.length;j++){
                            if(contentList[j].id == list[i].id){
                                flag = true;
                            }
                        }
                        if(!flag){
                            returnContent.push(list[i]);
                        }
                    }
                }
                multipleCheckItemAddService.setContent($scope.index,returnContent);


                var delIds = [];
                for(var m=0;m<returnContent.length;m++){
                    var delFlag = true;
                    for(var n=0;n<list.length;n++){
                        if(list[n].checked != undefined && list[n].checked != '' && list[n].checked && returnContent[m].id == list[n].id){
                            delFlag = false;
                        }
                    }
                    if(delFlag){
                        delIds.push(returnContent[m].id);
                    }
                }
                if(delIds.length >0){
                    for(var k=0;k<delIds.length;k++){
                        multipleCheckItemAddService.removeContent($scope.index,delIds[k]);
                    }
                }
                $scope.back();
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };

        }]);