angular.module('app.contract.material.purchase')
    .controller('MaterialPurchaseChargesController', ['$scope', '$state', '$stateParams', 'MaterialPurchaseService', function ($scope, $state, $stateParams, MaterialPurchaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.chargesInfo = MaterialPurchaseService.getCharges();
            var chargesInfo = MaterialPurchaseService.getCharges();
            var sum = 0;
            for (var i = 0; i < chargesInfo.length; i++) {
                sum += parseFloat(chargesInfo[i].money);
            }
            $scope.chargesSum = sum;
        });
    }]);