angular.module('app.contract.other')
    .controller('OtherInvoiceController', ['$scope', '$state', '$stateParams', 'OtherService', function ($scope, $state, $stateParams, OtherService) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.invoiceInfo = OtherService.getInvoice();
        });
    }]);