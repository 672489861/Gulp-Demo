angular.module('app.contract.equipment.lease')
    .controller('EquipmentLeaseChargesController', ['$scope', '$state', '$stateParams', 'EquipmentLeaseService', function ($scope, $state, $stateParams, EquipmentLeaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.chargesInfo = EquipmentLeaseService.getCharges();
            var chargesInfo = EquipmentLeaseService.getCharges();
            var sum = 0;
            for (var i = 0; i < chargesInfo.length; i++) {
                sum += parseFloat(chargesInfo[i].money);
            }
            $scope.chargesSum = sum;
        });
    }]);