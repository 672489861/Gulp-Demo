angular.module('app.contract.material.lease')
    .controller('MaterialLeaseChargesController', ['$scope', '$state', '$stateParams', 'MaterialLeaseService', function ($scope, $state, $stateParams, MaterialLeaseService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.chargesInfo = MaterialLeaseService.getCharges();
            var chargesInfo = MaterialLeaseService.getCharges();
            var sum = 0;
            for (var i = 0; i < chargesInfo.length; i++) {
                sum += parseFloat(chargesInfo[i].money);
            }
            $scope.chargesSum = sum;
        });
    }]);