angular.module('app.contract.subcontract')
    .controller('SubcontractChargesController', ['$scope', '$state', '$stateParams', 'SubcontractService', function ($scope, $state, $stateParams, SubcontractService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.chargesInfo = SubcontractService.getCharges();
            var chargesInfo = SubcontractService.getCharges();
            var sum = 0;
            for (var i = 0; i < chargesInfo.length; i++) {
                sum += parseFloat(chargesInfo[i].money);
            }
            $scope.chargesSum = sum;
        });
    }]);