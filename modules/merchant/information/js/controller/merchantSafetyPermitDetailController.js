angular.module('app.merchant.information')
    .controller('MerchantSafetyPermitDetailController', ['$scope', '$state', '$stateParams', 'MerchantService', function ($scope, $state, $stateParams, MerchantService) {
        //获取安全证书详细
        $scope.$on('$ionicView.loaded', function () {
            $scope.merchantSafetyPermitDetail = $stateParams.merchantSafetyPermitDetail;
            $scope.merchantSafetyPermitName = $scope.merchantSafetyPermitDetail.name;
            $scope.merchantSafetyPermitNumber = $scope.merchantSafetyPermitDetail.number;
            $scope.merchantSafetyPermitDeadline = $scope.merchantSafetyPermitDetail.deadline;
            $scope.attach = {
                name: $scope.merchantSafetyPermitDetail.safetypermitAttachName,
                url: $scope.merchantSafetyPermitDetail.url,
                fileSize: $scope.merchantSafetyPermitDetail.fileSize
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
    }]);
