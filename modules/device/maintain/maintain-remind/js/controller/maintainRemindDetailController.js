angular.module('app.device.maintain.maintain-remind')
    .controller('MaintainRemindDetailController', ['$scope', '$state', '$stateParams', 'MaintainRemindService','$ionicPopup', '$filter','YTService',
        function ($scope, $state, $stateParams, maintainRemindService,$ionicPopup,$filter,YTService) {

            $scope.$on('$ionicView.loaded', function () {
                maintainRemindService.resetCondition();
                $scope.condition = maintainRemindService.getCondition();
                $scope.image_list = [{item: false}, {item: false}];
                maintainRemindService.getDeviceRemindDetail($stateParams.id, function (data) {
                    $scope.deviceRemindInfo = data;
                });
            });
            //初始化进场时间（起）
            $scope.startTime = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.startTime = $filter('date')($scope.startTime.date, 'yyyy-MM-dd');
                    $scope.startTimerPopup.close();
                }
            });
            //结论字典
            maintainRemindService.getConclusion(function (data) {
                $scope.conclusions = data;
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
            $scope.closeCheckResult = function (item) {
                $scope.isCheckResult = false;
                if(item.id==1){
                    $scope.condition.breakdownName='';
                    $scope.condition.breakdownId = 0;
                }
                $scope.condition.conclusionName = item.name;
            };

            $scope.toBreakDown = function () {
                if($scope.condition.conclusionId==1){
                    $ionicPopup.alert({
                        template:'设备不存在故障，无须填写！'
                    })
                }else{
                    $state.go('device/maintain/maintain-remind/device-breakdown-deal',{id:$stateParams.id})
                }
            };

            // 一个确认对话框
            $scope.showConfirm = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '提示',
                    template: '<p class="text-center">您确定该设备已维保？</p>',
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        maintainRemindService.deviceMaintain($scope.deviceRemindInfo,function () {
                            $state.go('device/maintain/maintain-record/maintain-record-list',{success:true});
                        });
                    } else {

                    }
                });
            };

            $scope.maximumImagesCount = 1;
            $scope.addAttachment = function (type) {
                YTService.addAttachment($scope, function (item) {
                    item.typeId = type;
                    $scope.image_list[type].item = item;
                    maintainRemindService.pushImageList(item);
                });
            };
            $scope.previewOrDelete = function (index) {
                maintainRemindService.previewOrDelete(index,function () {
                    $scope.image_list[index].item=false;
                })
            };
        }]);