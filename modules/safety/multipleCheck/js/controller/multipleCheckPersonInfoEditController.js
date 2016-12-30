angular.module('app.safety.multipleCheck')
    .controller('multipleCheckPersonInfoEditController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService',
        '$stateParams','$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,
                  $stateParams,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                $scope.detail = multipleCheckItemAddService.getDetailData();
            });

            $scope.submit = function(){
                if($scope.validateTel()){
                    multipleCheckItemAddService.setPersonInfo($scope.detail);
                    $scope.back();
                }
            };

            $scope.validateTel = function () {
                if ($scope.detail.manager == "" || $scope.detail.manager == null) {
                    $ionicPopup.alert({title: '提示', template: '请输入项目经理姓名!'});
                    return false;
                }
                if ($scope.detail.technician == "" || $scope.detail.technician == null) {
                    $ionicPopup.alert({title: '提示', template: '请输入技术负责人姓名!'});
                    return false;
                }
                if ($scope.detail.inspector == "" || $scope.detail.inspector == null) {
                    $ionicPopup.alert({title: '提示', template: '请输入质检员姓名!'});
                    return false;
                }
                if ($scope.detail.safetyOfficer == "" || $scope.detail.safetyOfficer == null) {
                    $ionicPopup.alert({title: '提示', template: '请输入安全员姓名!'});
                    return false;
                }
                var re = /^1\d{10}$/;
                if ($scope.detail.managerTel != undefined && $scope.detail.managerTel != null && $scope.detail.managerTel != '' && !re.test($scope.detail.managerTel)) {
                    $ionicPopup.alert({title: '提示', template: '项目经理手机号不正确,请输入正确的手机号!'});
                    return false;
                }
                if ($scope.detail.technicianTel != undefined && $scope.detail.technicianTel != null && $scope.detail.technicianTel != '' && !re.test($scope.detail.technicianTel)) {
                    $ionicPopup.alert({title: '提示', template: '技术负责人手机号不正确,请输入正确的手机号!'});
                    return false;
                }
                if ($scope.detail.inspectorTel != undefined && $scope.detail.inspectorTel != null && $scope.detail.inspectorTel != '' && !re.test($scope.detail.inspectorTel)) {
                    $ionicPopup.alert({title: '提示', template: '质检员手机号不正确,请输入正确的手机号!'});
                    return false;
                }
                if ($scope.detail.safetyOfficerTel != undefined && $scope.detail.safetyOfficerTel != null && $scope.detail.safetyOfficerTel != '' && !re.test($scope.detail.safetyOfficerTel)) {
                    $ionicPopup.alert({title: '提示', template: '安全员手机号不正确,请输入正确的手机号!'});
                    return false;
                }
                return true;
            };

            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
