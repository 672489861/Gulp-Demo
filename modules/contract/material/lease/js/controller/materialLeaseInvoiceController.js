angular.module('app.contract.material.lease')
    .controller('MaterialLeaseInvoiceController', ['$scope', '$state', '$stateParams', 'MaterialLeaseService', function ($scope, $state, $stateParams, MaterialLeaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.invoiceInfo = MaterialLeaseService.getInvoice();
        });
    }]);