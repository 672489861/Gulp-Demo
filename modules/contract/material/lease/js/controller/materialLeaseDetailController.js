angular.module('app.contract.material.lease')
    .controller('MaterialLeaseDetailController', ['$scope', '$state', '$stateParams', 'MaterialLeaseService', '$sce', function ($scope, $state, $stateParams, MaterialLeaseService, $sce) {

        $scope.projectInfo = true;
        $scope.workmoney = true;
        $scope.leaseDetail = true;
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
        $scope.leaseDetailShow = function () {
            $scope.leaseDetail = !$scope.leaseDetail;
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
            MaterialLeaseService.queryDetail($stateParams.id, function (data) {
                $scope.leaseInfo = data;
                var beginTime = new Date(data.beginDate.replace(/-/g, "/"));
                var endTime = new Date(data.endDate.replace(/-/g, "/"));
                $scope.totalDays = ((endTime.getTime() - beginTime.getTime()) / 3600000 / 24) ;
                $scope.formatMoney = YTM.tool.money.numberToChineseCurrency(data.cost);
                $scope.memo = $sce.trustAsHtml(data.memo);
            });
            MaterialLeaseService.queryMaterial($stateParams.id, function (data) {
                $scope.materialLength = data.length;
            });
            MaterialLeaseService.queryCharges($stateParams.id, function (data) {
                $scope.chargesLength = data.length;
            });
            MaterialLeaseService.queryInvoice($stateParams.id, function (data) {
                $scope.invoiceLength = data.length;
            });
            MaterialLeaseService.queryAttach($stateParams.id, function (data) {
                $scope.attachInfo = data;
            });
        });

        $scope.downloadAttach = function (attach) {
            MaterialLeaseService.downloadAttach(attach);
        }
    }]);
