angular.module('app.frame.setting')
    .controller('SettingController', ['$scope', '$ionicActionSheet', 'SettingService', '$state', 'LocalStorageService', 'OfficeService', 'DashboardService',
        function ($scope, $ionicActionSheet, settingService, $state, localStorageService, officeService, dashboardService) {
            $scope.addAttachment = function () {
                $ionicActionSheet.show({
                    buttons: [
                        {text: '相机'},
                        {text: '图库'}
                    ],
                    cancelText: '关闭',
                    cancel: function () {
                        return true;
                    },
                    buttonClicked: function (index) {
                        return true;
                    }
                });
            };
            $scope.$on('$ionicView.beforeEnter', function () {
                settingService.getUserDetail(function (data) {
                    $scope.user = data;
                })
            });

            $scope.editTelephone = function () {
                $state.go('frame/setting/change-telephone');
            };

            $scope.logOut = function () {
                localStorageService.remove("tkt");
                localStorageService.remove("currentOrgId");
                localStorageService.remove("orgList");
                localStorageService.remove("moduleList");
                localStorageService.remove("userInfo");
                localStorageService.remove("notification");
                officeService.clearAll();
                dashboardService.clearCachedData();
                    JPushTool.stop();
                $state.go('login');
            };
        }]);
