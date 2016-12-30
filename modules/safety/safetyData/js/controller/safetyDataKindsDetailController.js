angular.module('app.safety.safetyData')
    .controller('SafetyDataKindsDetailController', ['$scope', '$ionicHistory', 'SafetyDataService', '$state', '$stateParams','$ionicPopup',
        function ($scope, $ionicHistory, safetyDataService, $state, $stateParams,$ionicPopup) {
            $scope.subs = $stateParams.subs;
            $scope.viewDetail = function (sub) {
                safetyDataService.getSafetyDataDetail(sub.id,function (data) {
                    if(data.length>0){
                        $state.go('safety/safetyData/safetyData-detail',{data:data});
                    }else{
                        $ionicPopup.alert({
                            template: '该分类暂无数据！'
                        })
                    }
                })
            }
        }]);
