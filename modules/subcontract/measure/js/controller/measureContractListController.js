/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.measure')
    .controller('MeasureContractListController', ['$scope', '$state', '$stateParams', 'MeasureContractListService',
        function ($scope, $state, $stateParams, measureContractListService) {

            $scope.merchantName = $stateParams.merchantName;

            $scope.$on('$ionicView.loaded', function () {
                measureContractListService.getMeasureContractDetail($stateParams.id, $stateParams.merchantId, function (data) {
                    $scope.measureContractDetails = data;
                });
            });

        }]);