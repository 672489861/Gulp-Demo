/**
 * Created by zjw on 2016/9/9.
 */
angular.module('app.subcontract.person')
    .controller('PersonDetailController', ['$scope', '$state', '$stateParams', 'PersonDetailService', 'YTService',
        function ($scope, $state, $stateParams, personDetailService, YTService) {

            $scope.$on('$ionicView.loaded', function () {
                $scope.attachment = false;
                personDetailService.getPersonDetail($stateParams.personId, function (data) {
                    $scope.personDetail = data;
                    if ($scope.personDetail.special == 1) {
                        $scope.attachment = true;
                    } else {
                        $scope.attachment = false;
                    }
                });
                personDetailService.getPersonAttach($stateParams.personId, function (normalAttach, specialAttach) {
                    $scope.normalAttach = normalAttach;
                    $scope.specialAttach = specialAttach;
                });
                // 查询本月累计工日
                personDetailService.getPersonWorkDays($stateParams.personId, function (result) {
                    $scope.workDays = result;
                });
                // 查询本月累计工时
                personDetailService.getPersonWorkHours($stateParams.personId, function (result) {
                    $scope.workHours = result;
                });
            });

            // 下载或查看附件
            $scope.download = function (attach) {
                YTService.download(attach);
            };

        }]);