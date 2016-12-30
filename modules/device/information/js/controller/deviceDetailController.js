angular.module('app.device.information')
    .controller('DeviceDetailController', ['$scope', '$state', '$stateParams', 'InformationService', function ($scope, $state, $stateParams, informationService) {
        //加载设备详细信息
        $scope.$on('$ionicView.loaded', function () {
            informationService.getDeviceInfoDetail($stateParams.id, function (data) {
                $scope.deviceInfo = data;
            });
        });

    }]);