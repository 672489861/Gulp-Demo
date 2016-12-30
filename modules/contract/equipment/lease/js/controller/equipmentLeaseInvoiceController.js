angular.module('app.contract.equipment.lease')
    .controller('EquipmentLeaseInvoiceController', ['$scope', '$state', '$stateParams', 'EquipmentLeaseService', function ($scope, $state, $stateParams, EquipmentLeaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.invoiceInfo = EquipmentLeaseService.getInvoice();
        });
    }]);