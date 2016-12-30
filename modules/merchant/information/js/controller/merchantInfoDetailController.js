angular.module('app.merchant.information')
    .controller('MerchantInfoDetailController', ['$scope', '$state', '$stateParams', 'MerchantService', function ($scope, $state, $stateParams, merchantService) {
        //获取客商详细
        $scope.$on('$ionicView.loaded', function () {
            merchantService.getMerchantDetail($stateParams.id, function (data) {
                $scope.merchantDetail = data;
            });
            //获取客商基础信息附件
            merchantService.getMerchantBaseAttachDetail($stateParams.id, function (data) {
                $scope.merchantBaseAttach = data;
            });
            //获取客商安全证书信息
            merchantService.getMerchantSafetyPermitDetail($stateParams.id, function (data) {
                $scope.merchantSafetyPermit = data;
            });
            //获取客商资质信息
            merchantService.getMerchantQualificationDetail($stateParams.id, function (data) {
                $scope.merchantQualification = data;
            });
        });

        //标识信息伸缩
        $scope.identification = true;
        $scope.identificationShow = function () {
            $scope.identification = !$scope.identification;
        };

        //基本信息伸缩
        $scope.essential = true;
        $scope.essentialShow = function () {
            $scope.essential = !$scope.essential;
        };

        //附件伸缩
        $scope.attachment = false;
        $scope.attachmentShow = function () {
            $scope.attachment = !$scope.attachment;
        };

        //资质信息伸缩
        $scope.qualification = false;
        $scope.qualificationShow = function () {
            $scope.qualification = !$scope.qualification;
        };

        //安全生产许可证书伸缩
        $scope.license = false;
        $scope.licenseShow = function () {
            $scope.license = !$scope.license;
        };

        //联系人伸缩
        $scope.contract = false;
        $scope.contractShow = function () {
            $scope.contract = !$scope.contract;
        };
    }]);