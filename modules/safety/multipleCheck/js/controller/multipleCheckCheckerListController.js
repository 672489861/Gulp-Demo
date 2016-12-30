angular.module('app.safety.multipleCheck')
    .controller('multipleCheckCheckerListController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService',
        '$stateParams','$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,
                  $stateParams,$ionicViewSwitcher) {


            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                $scope.checkerName = multipleCheckItemAddService.getDetailData().checkerName || '';
                $scope.checkerList = multipleCheckItemAddService.getExtraCheckerName() || [];
            });

            $scope.addChecker = function() {
                $ionicPopup.prompt({
                    title: '新增检查人',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    var flag = false;
                    for(var i=0;i<$scope.checkerList.length;i++){
                        if($scope.checkerList[i].name == res.trim()){
                            flag = true;
                            break;
                        }
                    }
                    if(!flag){
                        $scope.checkerList.push({name:res.trim()});
                    }
                });
            };

            $scope.deleteChecker = function($index){
                $ionicPopup.confirm({
                    title: '提示',
                    template: '<p class="text-center">确认删除？</p>',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function(res) {
                    if(res){
                        $scope.checkerList.splice($index,1);
                    }
                });
            };

            $scope.submit = function(){
                multipleCheckItemAddService.setExtraCheckerName($scope.checkerList);
                $scope.back();
            };

            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
