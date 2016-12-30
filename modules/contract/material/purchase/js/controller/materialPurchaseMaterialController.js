angular.module('app.contract.material.purchase')
    .controller('MaterialPurchaseMaterialController', ['$scope', '$state', '$stateParams', 'MaterialPurchaseService', function ($scope, $state, $stateParams, MaterialPurchaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.materialInfo = MaterialPurchaseService.getMaterial();
            var materialInfo = MaterialPurchaseService.getMaterial();
            var sum = 0;
            for (var i = 0; i < materialInfo.length; i++) {
                sum += parseFloat(materialInfo[i].total);
            }
            $scope.materialSum = sum;
        });
    }]);