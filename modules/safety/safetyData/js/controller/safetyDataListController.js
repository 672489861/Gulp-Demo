angular.module('app.safety.safetyData')
    .controller('SafetyDataListController', ['$scope', '$ionicHistory', '$cordovaToast', 'SafetyDataService','$state','$ionicPopup',
        function ($scope, $ionicHistory, $cordovaToast, safetyDataService,$state,$ionicPopup) {
            $scope.undevelop = function () {
                $cordovaToast.showShortBottom('暂未开发');
                //$ionicLoading.show({ template: '你要发的消息', noBackdrop: true, duration: 1000 });
            };

            $scope.refreshListData=function () {
                safetyDataService.getTreeData(function (data) {
                    $scope.dataList = data;
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };
            if(!$scope.dataList){
                safetyDataService.getTreeData(function (data) {
                    $scope.dataList = data;
                });
            }
            $scope.viewDetail=function (obj) {
                if(obj.subs.length==0){
                    safetyDataService.getSafetyDataDetail(obj.id,function (data) {
                        if(data.length>0){
                            $state.go('safety/safetyData/safetyData-detail',{data:data});
                        }else{
                            $ionicPopup.alert({
                                template: '该分类暂无数据！'
                            })
                        }
                    });
                }else{
                    $state.go('safety/safetyData/safetyData-kinds-detail',{subs:obj.subs});
                }
            };
            $scope.back = function () {
                $ionicHistory.goBack();
            };
            

        }]);
