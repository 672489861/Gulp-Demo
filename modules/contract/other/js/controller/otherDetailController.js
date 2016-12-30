angular.module('app.contract.other')
    .controller('OtherDetailController', ['$scope', '$state', '$stateParams', 'OtherService', '$sce', function ($scope, $state, $stateParams, OtherService, $sce) {

        $scope.projectInfo = true;
        $scope.workmoney = true;
        $scope.remark = true;
        $scope.attachment = true;
        $scope.bill = true;
        $scope.contractContent = true;


        $scope.projectInfoShow = function () {
            $scope.projectInfo = !$scope.projectInfo;
        };
        $scope.workmoneyShow = function () {
            $scope.workmoney = !$scope.workmoney;
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
        $scope.contractContentShow = function () {
            $scope.contractContent = !$scope.contractContent;
        };
        $scope.$on('$ionicView.loaded', function () {
            OtherService.queryDetail($stateParams.id, function (data) {
                $scope.otherInfo = data;
                $scope.formatMoney = YTM.tool.money.numberToChineseCurrency(data.cost);
                $scope.content = $sce.trustAsHtml(data.content);
                $scope.memo = $sce.trustAsHtml(data.memo);
            });
            OtherService.queryInvoice($stateParams.id, function (data) {
                $scope.invoiceLength = data.length;
            });
            OtherService.queryAttach($stateParams.id, function (data) {
                $scope.attachInfo = data;
            });
        });
        $scope.downloadAttach = function (attach) {
            OtherService. downloadAttach(attach);
        }

    }]);