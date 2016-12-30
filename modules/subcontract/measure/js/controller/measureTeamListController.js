/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.measure')
    .controller('MeasureTeamListController', ['$scope', '$state', '$stateParams', 'MeasureTeamListService',
        function ($scope, $state, $stateParams, measureTeamListService) {

            $scope.contractName = $stateParams.contractName;

            $scope.$on('$ionicView.loaded', function () {
                console.info($stateParams.contractId);
                measureTeamListService.getMeasureTeamDetail($stateParams.id, $stateParams.contractId, function (data) {
                    $scope.measureTeamDetails = data;
                });
            });

        }]);