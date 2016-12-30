angular.module('app.frame.setting')
    .controller('ChangeTelephoneController', ['$scope', 'SettingService', '$stateParams', '$ionicPopup','$state',
        function ($scope, settingService, $stateParams, $ionicPopup,$state) {
            $scope.$on('$ionicView.beforeEnter', function () {
                settingService.getUserDetail(function (data) {
                    $scope.modifyUser = data;
                });
            });
            $scope.updateTelephone = function () {
                settingService.upDateUser({telephone: $scope.modifyUser.telephone}, function (result) {
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
