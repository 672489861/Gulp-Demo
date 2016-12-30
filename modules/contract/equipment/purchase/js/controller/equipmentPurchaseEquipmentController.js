angular.module('app.contract.equipment.purchase')
    .controller('EquipmentPurchaseEquipmentController', ['$scope', '$state', '$stateParams', 'EquipmentPurchaseService', function ($scope, $state, $stateParams, EquipmentPurchaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.equipmentInfo = EquipmentPurchaseService.getEquipment();
            var equipmentInfo = EquipmentPurchaseService.getEquipment();
            var sum = 0;
            for (var i = 0; i < equipmentInfo.length; i++) {
                sum += parseFloat(equipmentInfo[i].total);
            }
            $scope.equipmentSum = sum;
        });
    }]);