angular.module('app.contract.subcontract')
    .controller('SubcontractSubcontractController', ['$scope', '$state', '$stateParams', 'SubcontractService', function ($scope, $state, $stateParams, SubcontractService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.subcontractInfo = SubcontractService.getSubcontract();
            var subcontractInfo = SubcontractService.getSubcontract();
            var sum = 0;
            for (var i = 0; i < subcontractInfo.length; i++) {
                sum += parseFloat(subcontractInfo[i].total);
            }
            $scope.subcontractSum = sum;
        });
    }]);