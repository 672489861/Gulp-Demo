angular.module('app.contract.material.purchase')
    .controller('MaterialPurchaseInvoiceController', ['$scope', '$state', '$stateParams', 'MaterialPurchaseService', function ($scope, $state, $stateParams, MaterialPurchaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.invoiceInfo = MaterialPurchaseService.getInvoice();
        });
    }]);