angular.module('app.frame.setting')
    .controller('ChangeEmailController', ['$scope', 'SettingService', '$stateParams', '$ionicPopup','$state',
        function ($scope, settingService, $stateParams, $ionicPopup,$state) {
            $scope.$on('$ionicView.beforeEnter', function () {
                settingService.getUserDetail(function (data) {
                    $scope.modifyUser = data;
                });
            });
            $scope.updateEmail = function () {
                settingService.upDateUser({email: $scope.modifyUser.email}, function (result) {
                    if (result.status == 200) {
                        $ionicPopup.alert({
                            template: '修改成功！'
                        }).then(function (res) {
                            $state.go('tabs.setting');
                        });
                    }else{
                        $ionicPopup.alert({
                            template: '修改失败,请稍后再试！'
                        })
                    }
                })
            };
        }]);
