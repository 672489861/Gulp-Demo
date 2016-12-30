angular.module('app.contract.subcontract')
    .controller('SubcontractDetailController', ['$scope', '$state', '$stateParams', 'SubcontractService', '$sce', function ($scope, $state, $stateParams, SubcontractService, $sce) {

        $scope.projectInfo = true;
        $scope.workmoney = true;
        $scope.subcontractDetail = true;
        $scope.quality = true;
        $scope.remark = true;
        $scope.attachment = true;
        $scope.bill = true;
        $scope.worktime = true;


        $scope.worktimeShow = function () {
            $scope.worktime = !$scope.worktime;
        };
        $scope.projectInfoShow = function () {
            $scope.projectInfo = !$scope.projectInfo;
        };
        $scope.workmoneyShow = function () {
            $scope.workmoney = !$scope.workmoney;
        };
        $scope.subcontractDetailShow = function () {
            $scope.subcontractDetail = !$scope.subcontractDetail;
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
            SubcontractService.queryDetail($stateParams.id, function (data) {
                $scope.subcontractInfo = data;
                $scope.formatMoney = YTM.tool.money.numberToChineseCurrency(data.cost);
                $scope.memo = $sce.trustAsHtml(data.memo);
            });
            SubcontractService.querySubcontract($stateParams.id, function (data) {
                $scope.subcontractLength = data.length;
            });
            SubcontractService.queryCharges($stateParams.id, function (data) {
                $scope.chargesLength = data.length;
            });
            SubcontractService.queryInvoice($stateParams.id, function (data) {
                $scope.invoiceLength = data.length;
            });
            SubcontractService.queryAttach($stateParams.id, function (data) {
                $scope.attachInfo = data;
            });
        });

        $scope.downloadAttach = function (attach) {
            SubcontractService. downloadAttach(attach);
        }

    }]);