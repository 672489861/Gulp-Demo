angular.module('app.safety.multipleCheck')
    .controller('multipleCheckItemAddRandomInfoController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService', '$stateParams',
        '$ionicViewSwitcher','$ionicActionSheet',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,$stateParams,
                  $ionicViewSwitcher,$ionicActionSheet) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                var spotContentList = multipleCheckItemAddService.getSpot() || [];
                if(spotContentList.length <=0){
                    if(multipleCheckItemAddService.getType() == 'add'){
                        multipleCheckItemAddService.querySpotContent(function(data){
                            $scope.spotContentList = data;
                        });
                    }
                    if(multipleCheckItemAddService.getType() == 'edit'){
                        $scope.spotContentList = multipleCheckItemAddService.getSpot();
                    }
                }else{
                    $scope.spotContentList = spotContentList;
                }
                multipleCheckItemAddService.querySpotCheck(function(data){
                    $scope.spotCheckList = data || [];
                });
            });

            $scope.openCheckType = function($index){
                var btns = [];
                for(var i=0;i<$scope.spotCheckList.length;i++){
                    btns.push({ text: $scope.spotCheckList[i].name});
                }
                $ionicActionSheet.show({
                    buttons: btns,
                    cancelText: '取消',
                    cancel: function() {
                        return true;
                    },
                    buttonClicked: function(index) {
                        $scope.spotContentList[$index].spotCheckId = $scope.spotCheckList[index].id;
                        $scope.spotContentList[$index].spotCheckName = $scope.spotCheckList[index].name;
                        return true;
                    }
                });
            };

            $scope.submit = function(){
                if($scope.validate()){
                    multipleCheckItemAddService.setSpot($scope.spotContentList);
                    $scope.back();
                }
            };

            $scope.validate = function () {
                var content = $scope.spotContentList || [];
                var flag = true;
                var count = 0;
                for(var i=0;i<content.length;i++){
                    if(content[i].rowspan > 0){
                        if(content[i].spotCheckId == -1){
                            flag = false;
                        }else if(content[i].spotCheckName == '无' || content[i].spotCheckName == '不齐全'){
                            count++;
                        }
                    }
                }
                if(!flag){
                    $ionicPopup.alert({title: '提示', template: '请选择完整抽查情况!'});
                }
                if(flag){
                    multipleCheckItemAddService.setSpotCount(count);
                }
                return flag;
            };

            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
