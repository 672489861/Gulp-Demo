angular.module('app.contract.equipment.lease')
    .controller('EquipmentLeaseEquipmentController', ['$scope', '$state', '$stateParams', 'EquipmentLeaseService', function ($scope, $state, $stateParams, EquipmentLeaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.equipmentInfo = EquipmentLeaseService.getEquipment();
            var equipmentInfo = EquipmentLeaseService.getEquipment();
            var sum = 0;
            for (var i = 0; i < equipmentInfo.length; i++) {
                sum += parseFloat(equipmentInfo[i].rentPrice * equipmentInfo[i].quantity);
            }
            $scope.equipmentSum = sum;
        });
    }]);