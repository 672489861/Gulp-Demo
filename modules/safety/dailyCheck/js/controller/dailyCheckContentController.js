angular.module('app.safety.dailyCheck')
    .controller('dailyCheckContentController', ['$scope', '$state', '$stateParams','$ionicPopup', 'dailyCheckAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,dailyCheckAddService,$ionicViewSwitcher) {

            $scope.content =[];
            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                dailyCheckAddService.queryCheckContent(-1,1,function(data){
                    $scope.content = data;
                    $scope.checkContent($scope.content);
                });

            });
            $scope.checkContent = function(){
                var contentList = dailyCheckAddService.getContent();
                if($scope.content != undefined){
                    for(var j=0;j<$scope.content.length;j++){
                        var flag = false;
                        if(contentList != undefined){
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
                var contentList = dailyCheckAddService.getContent();
                for(var i=0;i<list.length;i++){
                    if(list[i].checked != undefined && list[i].checked != '' && list[i].checked){
                        var flag = false;
                        for(var j=0;j<contentList.length;j++){
                            if(contentList[j].id == list[i].id){
                                flag = true;
                            }
                        }
                        if(!flag){
                            dailyCheckAddService.pushContent(list[i]);
                        }
                    }
                }
                var delIds = [];
                for(var m=0;m<contentList.length;m++){
                    var delFlag = true;
                    for(var n=0;n<list.length;n++){
                        if(list[n].checked != undefined && list[n].checked != '' && list[n].checked && contentList[m].id == list[n].id){
                            delFlag = false;
                        }
                    }
                    if(delFlag){
                        delIds.push(contentList[m].id);
                    }
                }
                if(delIds.length >0){
                    for(var k=0;k<delIds.length;k++){
                        dailyCheckAddService.removeContent(delIds[k]);
                    }
                }


                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };

        }]);