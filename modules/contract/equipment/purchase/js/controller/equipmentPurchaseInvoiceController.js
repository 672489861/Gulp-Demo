angular.module('app.contract.equipment.purchase')
    .controller('EquipmentPurchaseInvoiceController', ['$scope', '$state', '$stateParams', 'EquipmentPurchaseService', function ($scope, $state, $stateParams, EquipmentPurchaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.invoiceInfo = EquipmentPurchaseService.getInvoice();
        });
    }]);