angular.module('app.frame.setting')
    .controller('ChangePasswordController', ['$scope', 'SettingService', '$stateParams', '$ionicPopup', '$state',
        function ($scope, settingService, $stateParams, $ionicPopup, $state) {
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.pd={oldPd: '',newPd : '',newPdRepeat : ''};
            });
            $scope.updatePassword = function () {
                settingService.updatePassword($scope.pd.oldPd, $scope.pd.newPd, $scope.pd.newPdRepeat, function () {
                    $state.go('/login');
                });
            };
        }]);
