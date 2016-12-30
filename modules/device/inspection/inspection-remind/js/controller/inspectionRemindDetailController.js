angular.module('app.device.inspection.inspection-remind')
    .controller('InspectionRemindDetailController', ['$scope', '$state', '$stateParams', 'RemindService', '$ionicPopup', '$filter', 'YTService',
        function ($scope, $state, $stateParams, remindService, $ionicPopup, $filter, YTService) {
            $scope.isCheckResult = false;
            $scope.$on('$ionicView.loaded', function () {
                remindService.resetCondition();
                $scope.condition = remindService.getCondition();
                $scope.image_list = [{item: false}, {item: false}, {item: false}];
                remindService.getDeviceRemindDetail($stateParams.id, function (data) {
                    $scope.deviceRemindInfo = data;
                });
            });
            //初始化进场时间（起）
            $scope.startTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.inspectionTime = $filter('date')($scope.startTime.date, 'yyyy-MM-dd');
                    $scope.startTimerPopup.close();
                }
            });
            //处理打开进场时间（起）弹框
            $scope.openStartTime = function () {
                $scope.startTimerPopup = $ionicPopup.show({
                    templateUrl: "start-time.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.startTimerPopup.then(function (res) {

                });
            };

            //展开工程类别列表
            $scope.openCheckResult = function () {
                $scope.isCheckResult = true;
            };
            //关闭工程类别列表并回显数据
            $scope.closeCheckResult = function (name) {
                $scope.isCheckResult = false;
                $scope.condition.conclusionName = name;
            };
            //结论字典
            remindService.getConclusion(function (data) {
                $scope.conclusions = data;
            });

            // 一个确认对话框
            $scope.showConfirm = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: '提示',
                    template: '<p class="text-center">您确定该设备已检验？</p>',
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        remindService.deviceRemind($stateParams.id, $scope.deviceRemindInfo, function () {
                            $state.go('device/inspection/inspection-record/inspection-record-list', {success: true});
                        })
                    } else {

                    }
                });
            };
            $scope.maximumImagesCount = 1;
            $scope.addAttachment = function (type) {
                YTService.addAttachment($scope, function (item) {
                    item.typeId = type;
                    $scope.image_list[type].item = item;
                    remindService.pushImageList(item);
                });
            };
            $scope.previewOrDelete = function (index) {
                remindService.previewOrDelete(index,function () {
                    $scope.image_list[index].item=false;
                })
            };
        }]);