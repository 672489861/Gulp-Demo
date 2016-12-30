angular.module('app.contract.equipment.purchase')
    .controller('EquipmentPurchaseChargesController', ['$scope', '$state', '$stateParams', 'EquipmentPurchaseService', function ($scope, $state, $stateParams, EquipmentPurchaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.chargesInfo = EquipmentPurchaseService.getCharges();
            var chargesInfo = EquipmentPurchaseService.getCharges();
            var sum = 0;
            for (var i = 0; i < chargesInfo.length; i++) {
                sum += parseFloat(chargesInfo[i].money);
            }
            $scope.chargesSum = sum;
        });
    }]);