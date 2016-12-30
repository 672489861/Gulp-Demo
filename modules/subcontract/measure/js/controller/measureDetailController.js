/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.measure')
    .controller('MeasureDetailController', ['$scope', '$state', '$stateParams', 'MeasureDetailService',
        function ($scope, $state, $stateParams, measureDetailService) {

            $scope.$on('$ionicView.loaded', function () {
                measureDetailService.getMeasure($stateParams.id, function (data) {
                    $scope.measure = data;
                });
                measureDetailService.getMeasureDetail($stateParams.id, function (data) {
                    $scope.measureDetail = data;
                });
            });
        }
    ]);