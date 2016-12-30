angular.module('app.contract.material.purchase')
    .controller('MaterialPurchaseDetailController', ['$scope', '$state', '$stateParams', 'MaterialPurchaseService', '$sce', function ($scope, $state, $stateParams, MaterialPurchaseService, $sce) {

        $scope.projectInfo = true;
        $scope.workmoney = true;
        $scope.purchaseDetail = true;
        $scope.quality = true;
        $scope.remark = true;
        $scope.attachment = true;
        $scope.bill = true;

        $scope.projectInfoShow = function () {
            $scope.projectInfo = !$scope.projectInfo;
        };
        $scope.workmoneyShow = function () {
            $scope.workmoney = !$scope.workmoney;
        };
        $scope.purchaseDetailShow = function () {
            $scope.purchaseDetail = !$scope.purchaseDetail;
        };
        $scope.qualityShow = function () {
            $scope.quality = !$scope.quality;
        };
        $scope.remarkShow = function () {
            $scope.remark = !$scope.remark;
        };
        $scope.attachmentShow = function () {
            $scope.attachment = !$scope.attachment;
        };
        $scope.billShow = function () {
            $scope.bill = !$scope.bill;
        };

        $scope.$on('$ionicView.loaded', function () {
            MaterialPurchaseService.queryDetail($stateParams.id, function (data) {
                $scope.purchaseInfo = data;
                $scope.formatMoney = YTM.tool.money.numberToChineseCurrency(data.cost);
                $scope.materialQualityText = $sce.trustAsHtml(data.materialQualityText);
                $scope.memo = $sce.trustAsHtml(data.memo);
            });
            MaterialPurchaseService.queryMaterial($stateParams.id, function (data) {
                $scope.materialLength = data.length;
            });
            MaterialPurchaseService.queryCharges($stateParams.id, function (data) {
                $scope.chargesLength = data.length;
            });
            MaterialPurchaseService.queryInvoice($stateParams.id, function (data) {
                $scope.invoiceLength = data.length;
            });
            MaterialPurchaseService.queryAttach($stateParams.id, function (data) {
                $scope.attachInfo = data;
            });
        });

        $scope.downloadAttach = function (attach) {
            MaterialPurchaseService. downloadAttach(attach);
        }

    }]);