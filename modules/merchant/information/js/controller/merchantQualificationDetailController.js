angular.module('app.merchant.information')
    .controller('MerchantQualificationDetailController', ['$scope', '$state', '$stateParams', 'MerchantService', function ($scope, $state, $stateParams, MerchantService) {
        //获取资质信息数据
        $scope.$on('$ionicView.loaded', function () {
            $scope.merchantQualificationDetail = $stateParams.merchantQualificationDetail;
            $scope.merchantQualificationName = $scope.merchantQualificationDetail.qualificationName;
            $scope.merchantQualificationNumber = $scope.merchantQualificationDetail.qualificationNo;
            $scope.merchantQualificationLevelName = $scope.merchantQualificationDetail.levelName;
            $scope.attach = {
                name: $scope.merchantQualificationDetail.qualificationAttachName,
                url: $scope.merchantQualificationDetail.url,
                fileSize: $scope.merchantQualificationDetail.fileSize
            };
        });
        //下载附件
        $scope.download = function (attach) {
            MerchantService.downloadAttach(attach);
        };
        $scope.attachment = true;
        $scope.attachmentShow = function () {
            $scope.attachment = !$scope.attachment;
        };
    }])
;
