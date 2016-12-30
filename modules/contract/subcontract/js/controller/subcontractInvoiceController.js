angular.module('app.contract.subcontract')
    .controller('SubcontractInvoiceController', ['$scope', '$state', '$stateParams', 'SubcontractService', function ($scope, $state, $stateParams, SubcontractService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.invoiceInfo = SubcontractService.getInvoice();
        });
    }]);