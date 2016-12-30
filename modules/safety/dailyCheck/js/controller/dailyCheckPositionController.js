angular.module('app.safety.dailyCheck')
    .controller('dailyCheckPositionController', ['$scope', '$state', '$stateParams','$ionicPopup', 'dailyCheckAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,dailyCheckAddService,$ionicViewSwitcher) {

            $scope.showLocationAdd = true;
            $scope.showLocation = true;
            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                if(dailyCheckAddService.getPositionList().length <=0){
                    dailyCheckAddService.queryCheckPosition(function(data){
                        $scope.checkPosition = data;
                        dailyCheckAddService.setPositionList(data);
                        $scope.showLocation = ($scope.checkPosition.length >0);
                    });
                }else{
                    $scope.checkPosition = dailyCheckAddService.getPositionList();
                    $scope.showLocation = ($scope.checkPosition.length >0);
                }
                $scope.checkDataShow = dailyCheckAddService.getCheckDataShow();
                $scope.showLocationAdd = ($scope.checkDataShow.addPositionName.length >0);
            });
            $scope.choosePosition = function (obj) {
                if(obj.id == undefined || obj.id == ''){
                    obj.id = -1;
                }
                $scope.setPosition(obj);
                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.showPrompt = function() {
                $ionicPopup.prompt({
                    title: '新增位置',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    if (res != "" && res != undefined && !$scope.checkNewPosition(res.trim())) {
                        dailyCheckAddService.pushAddPositionName({name:res.trim()});
                        $scope.checkDataShow = dailyCheckAddService.getCheckDataShow();
                        $scope.setPosition({id:-1,name:res.trim()});
                        $scope.showLocationAdd = true;
                    }
                });
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };

            $scope.checkNewPosition = function(name){
                var positionList =dailyCheckAddService.getPositionList();
                var flag = false;
                for(var i=0;i<positionList.length;i++){
                    if(positionList[i].name.trim() == name.trim()){
                        flag = true;
                        dailyCheckAddService.setCheckPosId(positionList[i].id);
                        dailyCheckAddService.setCheckPositionName(positionList[i].name);
                    }
                }
                dailyCheckAddService.setPositionList(positionList);
                return flag;
            };

            $scope.setPosition = function(obj){
                var positionList =dailyCheckAddService.getPositionList();
                var flag = false;
                for(var i=0;i<positionList.length;i++){
                    if(positionList[i].id == obj.id){
                        flag = flag || true;
                        dailyCheckAddService.setCheckPosId(positionList[i].id);
                        dailyCheckAddService.setCheckPositionName(positionList[i].name);
                    }else{
                        flag = flag || false;
                    }
                }
                dailyCheckAddService.setPositionList(positionList);
                if(!flag){
                    var positionAddList = dailyCheckAddService.getCheckDataShow().addPositionName;
                    for(var j=0;j<positionAddList.length;j++){
                        if(positionAddList[j].name == obj.name){
                            dailyCheckAddService.setCheckPosId(positionAddList[j].id);
                            dailyCheckAddService.setCheckPositionName(positionAddList[j].name);
                        }
                    }
                    dailyCheckAddService.setAddPosition(positionAddList);
                }
            };

        }]);