angular.module('app.device.maintain.maintain-record')
    .controller('MaintainRecordDetailController', ['$scope', '$state', '$stateParams', 'MaintainRecordService','YTService',
        function ($scope, $state, $stateParams, maintainRecordService,YT) {

            $scope.$on('$ionicView.loaded', function () {
                maintainRecordService.getDeviceRecordDetail($stateParams.id, function (data) {
                    maintainRecordService.getAttaches(data.maintainId,function (attaches) {
                        $scope.attaches = attaches;
                    });
                    $scope.deviceRecordInfo = data;
                });
            });
            $scope.download=function (attach) {
                YT.download(attach);
            };
        }]);