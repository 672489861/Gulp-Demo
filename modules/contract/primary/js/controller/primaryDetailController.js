angular.module('app.contract.primary')
    .controller('PrimaryDetailController', ['$scope', '$state', '$stateParams', 'PrimaryService', function ($scope, $state, $stateParams, primaryService) {

        $scope.$on('$ionicView.loaded', function () {
            primaryService.getPrimaryDetail($stateParams.id, function (data) {
                $scope.primaryInfo = data;
                $scope.formatMoney = YTM.tool.money.numberToChineseCurrency(data.amount * 10000);

            });
        });
        primaryService.queryPrimaryAttach($stateParams.id, function (data) {
            $scope.attaches = data;
        });
        $scope.downloadAttach = function (attach) {
            primaryService.downloadAttach(attach);
        };
        $scope.back = function () {
            if (primaryService.getTypeId() == 3) {
                $state.go('menu');
            } else {
                $state.go('contract/primary/primary-list');
            }
        };
    }]);