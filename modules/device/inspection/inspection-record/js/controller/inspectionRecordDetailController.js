angular.module('app.device.inspection.inspection-record')
    .controller('InspectionRecordDetailController', ['$scope', '$state', '$stateParams', 'RecordService','YTService',
        function ($scope, $state, $stateParams, recordService,YT) {

            $scope.$on('$ionicView.loaded', function () {
                recordService.getDeviceRecordDetail($stateParams.id, function (data) {
                    recordService.getAttaches(data.inspectionId, function (attaches) {
                        $scope.attaches = attaches;
                    });
                    $scope.deviceRecordInfo = data;
                });
            });
            $scope.download=function (attach) {
                YT.download(attach);
            };
        }]);