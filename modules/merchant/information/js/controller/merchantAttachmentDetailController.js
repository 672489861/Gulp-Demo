angular.module('app.merchant.information')
    .controller('MerchantAttachmentDetailController', ['$scope', '$state', '$stateParams', 'MerchantService', function ($scope, $state, $stateParams, MerchantService) {
        //获取客商基础信息附件详细
        $scope.$on('$ionicView.loaded', function () {
            $scope.merchantBaseDetail = $stateParams.merchantBaseAttachList;
            $scope.attach = {
                name: $scope.merchantBaseDetail.name,
                url: $scope.merchantBaseDetail.url,
                fileSize: $scope.merchantBaseDetail.fileSize
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
