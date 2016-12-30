angular.module('app.contract.material.lease')
    .controller('MaterialLeaseMaterialController', ['$scope', '$state', '$stateParams', 'MaterialLeaseService', function ($scope, $state, $stateParams, MaterialLeaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.materialInfo = MaterialLeaseService.getMaterial();
            var materialInfo = MaterialLeaseService.getMaterial();
            var sum = 0;
            for (var i = 0; i < materialInfo.length; i++) {
                sum += parseFloat(materialInfo[i].quantity * materialInfo[i].rentPrice);
            }
            $scope.materialSum = sum;
            console.log($scope.materialSum)
        });
    }]);