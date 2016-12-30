angular.module('app.safety.multipleCheck')
    .controller('multipleCheckProjectInfoEditController',[
        '$scope','$state','$ionicPopup','multipleCheckItemAddService',
        '$stateParams','$ionicViewSwitcher',
        function ($scope,$state, $ionicPopup,multipleCheckItemAddService,
                  $stateParams,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if($stateParams.backUrl){
                    $scope.backUrl = $stateParams.backUrl;
                }
                $scope.detail = multipleCheckItemAddService.getDetailData() || {};
            });

            $scope.toChooseStructureType = function(){
                $state.go('safety/multipleCheck/multipleCheck-structure-type',
                    {backUrl:'safety/multipleCheck/multipleCheck-project-info-edit',
                    preBackUrl:$scope.backUrl});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.submit = function(){
                if($scope.validateTel()){
                    multipleCheckItemAddService.setProjectInfo($scope.detail);
                    $scope.back();
                }
            };

            $scope.validateTel = function () {
                var re1 = /^[0-9]+(.[0-9]{2})?$/;
                if (!re1.test($scope.detail.areaOfStructure)) {
                    $ionicPopup.alert({title: '提示', template: '建筑面积格式不正确,请输入正确的建筑面积(2位小数)!'});
                    return false;
                }
                if (!re1.test($scope.detail.cost)) {
                    $ionicPopup.alert({title: '提示', template: '造价格式不正确,请输入正确的造价(2位小数)!'});
                    return false;
                }
                var re2 = /^\+?[1-9][0-9]*$/;
                if (!re2.test($scope.detail.groundLayer)) {
                    $ionicPopup.alert({title: '提示', template: '地上层数格式不正确,请输入正确的地上层数!'});
                    return false;
                }
                if (!re2.test($scope.detail.underGroundLayer)) {
                    $ionicPopup.alert({title: '提示', template: '地下层数格式不正确,请输入正确的地下层数!'});
                    return false;
                }
                if (!re2.test($scope.detail.personNumber)) {
                    $ionicPopup.alert({title: '提示', template: '参建人数格式不正确,请输入正确的参建人数!'});
                    return false;
                }
                return true;
            };

            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/multipleCheck/multipleCheck-item-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
