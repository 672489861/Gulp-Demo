angular.module('app.safety.multipleCheck')
    .controller('multipleCheckPositionController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService',
        '$stateParams','$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,
                  $stateParams,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                var positionList = multipleCheckItemAddService.getPositionList() || [];
                if(positionList.length <= 0){
                    multipleCheckItemAddService.queryCheckPosition(function(data){
                        $scope.positionList = data || [];
                    });
                }else{
                    $scope.positionList = positionList;
                }

                $scope.addPositionList = multipleCheckItemAddService.getAddPositionList() || [];
                $scope.groupList = multipleCheckItemAddService.getGroupDataList() || [];
                $scope.position = {name:''};
            });

            $scope.showPrompt = function() {
                $ionicPopup.prompt({
                    title: '新增位置',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    if (res != "" && res != undefined && res) {
                        if(!$scope.checkName(res.trim())){
                            $scope.addPositionList.push({id:-1,name:res.trim()});
                        }
                    }
                });
            };

            $scope.checkName = function(name){
                var flag = false;
                var id = -4;
                var positionName = '';
                $scope.positionList = $scope.positionList || [];
                for(var i=0;i<$scope.positionList.length;i++){
                    if($scope.positionList[i].name == name){
                        id = $scope.positionList[i].id;
                        positionName = $scope.positionList[i].name;
                        flag = true;
                        break;
                    }
                }

                $scope.addPositionList = $scope.addPositionList || [];
                if(!flag && $scope.addPositionList.length > 0){
                    for(var j=0;j<$scope.addPositionList.length;j++){
                        if($scope.addPositionList[j].name == name){
                            id = -1;
                            positionName = $scope.addPositionList[j].name;
                            flag = true;
                            break;
                        }
                    }
                }
                $scope.position = {id:id,name:positionName};
                return flag;
            };

            $scope.choosePosition = function(obj){
                var position = multipleCheckItemAddService.getPosition() || [];
                var flag = false;
                for(var i=0;i<position.length;i++){
                    if(position[i].name == obj.name){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    obj.addFlag = false;
                    if(obj.id == undefined || obj.id == '' || obj.id == -1){
                        obj.addFlag = true;
                        obj.id = -1;
                    }
                    multipleCheckItemAddService.pushPosition(obj);
                    multipleCheckItemAddService.pushGroupData(obj);
                    $scope.back();
                }else{
                    $ionicPopup.alert({title: '提示', template: '该位置已存在!'});
                }
            };

            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
